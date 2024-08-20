// src/features/parkingSlot/parkingSlotSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Reservation } from "@/lib/db/idb";
import {
	addReservation,
	getOpenReservations,
	getReservations,
	getSlots,
	updateReservation,
	setSlots,
} from "@/lib/repositories/parkingSlotRepository";
interface OpenReservations {
	slotIndex: number;
	vehicleId: string | null;
}

interface ParkingSlotState {
	slots: boolean[];
	openReservations: OpenReservations[];
	reservations: Reservation[];
	status: "idle" | "loading" | "failed";
	error: string | null;
}
const initialState: ParkingSlotState = {
	slots: [],
	openReservations: [],
	reservations: [],
	status: "idle",
	error: null,
};

export const initializeFromDB = createAsyncThunk(
	"parkingSlot/initializeFromDB",
	async () => {
		const [slots, openReservations, reservations] = await Promise.all([
			getSlots(),
			getOpenReservations(),
			getReservations(),
		]);
		return {
			slots,
			openReservations,
			reservations,
		};
	}
);

export const initializeSlotsAsync = createAsyncThunk(
	"parkingSlot/initializeSlots",
	async (slotCount: number) => {
		let slots = await getSlots();
		if (slots.length !== slotCount) {
			slots = new Array(slotCount).fill(false);
		}
		const openReservations = await getOpenReservations();
		await setSlots(slots);
		return { slots, openReservations };
	}
);

export const reserveSlotAsync = createAsyncThunk(
	"parkingSlot/reserveSlot",
	async ({ vehicleId }: { vehicleId: string }, { getState }) => {
		const state = getState() as { parkingSlot: ParkingSlotState };
		const index = state.parkingSlot.slots.findIndex(
			(isReserved) => !isReserved
		);
		if (index !== -1) {
			const newSlots = [...state.parkingSlot.slots];
			newSlots[index] = true;
			const newOpenReservations = [
				...state.parkingSlot.openReservations,
				{
					slotIndex: index,
					vehicleId: vehicleId,
				},
			];
			const newReservation: Reservation = {
				id: Date.now().toString(),
				vehicleId,
				slotIndex: index,
				entryDate: new Date(),
				exitDate: null,
			};
			await Promise.all([
				setSlots(newSlots),
				addReservation(newReservation),
			]);
			return { index, vehicleId, newReservation, newOpenReservations };
		}
		throw new Error("No available slots");
	}
);

export const freeSlotAsync = createAsyncThunk(
	"parkingSlot/freeSlot",
	async (slotIndex: number, { getState }) => {
		const state = getState() as { parkingSlot: ParkingSlotState };
		if (state.parkingSlot.slots[slotIndex]) {
			const newSlots = [...state.parkingSlot.slots];
			newSlots[slotIndex] = false;
			// Create a new object without the slotIndex property
			const newOpenReservations = [
				...state.parkingSlot.openReservations,
			].filter((r) => r.slotIndex !== slotIndex);

			const vehicleId = state.parkingSlot.openReservations.find(
				(r) => r.slotIndex === slotIndex
			)?.vehicleId;
			const reservation = state.parkingSlot.reservations.find(
				(r) =>
					r.vehicleId === vehicleId &&
					r.slotIndex === slotIndex &&
					r.exitDate === null
			);
			if (reservation) {
				const updatedReservation = {
					...reservation,
					exitDate: new Date(),
				};
				await Promise.all([
					setSlots(newSlots),
					updateReservation(updatedReservation),
				]);
				return {
					slotIndex,
					updatedReservation,
					newOpenReservations,
				};
			}
		}
		throw new Error("Slot not reserved or reservation not found");
	}
);

export const parkingSlotSlice = createSlice({
	name: "parkingSlot",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(initializeFromDB.pending, (state) => {
				state.status = "loading";
			})
			.addCase(initializeFromDB.fulfilled, (state, action): any => {
				state.status = "idle";
				state.slots = action.payload.slots;
				state.openReservations = action.payload.openReservations;
				state.reservations = action.payload.reservations;
			})
			.addCase(initializeFromDB.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message ?? "Failed to initialize from DB";
			})
			.addCase(initializeSlotsAsync.fulfilled, (state, action) => {
				state.slots = action.payload.slots;
				state.openReservations = action.payload.openReservations;
			})
			.addCase(reserveSlotAsync.fulfilled, (state, action) => {
				state.slots[action.payload.index] = true;
				state.openReservations = action.payload.newOpenReservations;
				state.reservations.push(action.payload.newReservation);
			})
			.addCase(freeSlotAsync.fulfilled, (state, action) => {
				state.slots[action.payload.slotIndex] = false;
				state.openReservations = action.payload.newOpenReservations;
				const index = state.reservations.findIndex(
					(r) => r.id === action.payload.updatedReservation.id
				);
				if (index !== -1) {
					state.reservations[index] =
						action.payload.updatedReservation;
				}
			});
	},
});

export default parkingSlotSlice.reducer;
