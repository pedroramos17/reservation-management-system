// src/features/parkingSlot/parkingSlotSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Booking, Bill } from "@/lib/db/idb";
import {
	addBooking,
	getOpenBookings,
	getBookings,
	getSlots,
	updateBooking,
	setSlots,
	addBill,
	getBills,
} from "@/lib/repositories/parkingSlotRepository";
interface OpenBookings {
	slotIndex: number;
	vehicleId: string | null;
}
interface ParkingSlotState {
	slots: boolean[];
	openBookings: OpenBookings[];
	bookings: Booking[];
	bills: Bill[];
	status: "idle" | "loading" | "failed";
	error: string | null;
}
const initialState: ParkingSlotState = {
	slots: [],
	openBookings: [],
	bookings: [],
	bills: [],
	status: "idle",
	error: null,
};

export const initializeFromDB = createAsyncThunk(
	"parkingSlot/initializeFromDB",
	async () => {
		const [slots, openBookings, bookings, bills] = await Promise.all([
			getSlots(),
			getOpenBookings(),
			getBookings(),
			getBills(),
		]);
		return {
			slots,
			openBookings,
			bookings,
			bills,
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
		const openBookings = await getOpenBookings();
		await setSlots(slots);
		return { slots, openBookings };
	}
);

type ReserveProps = {
	newSlots: boolean[];
	newBooking: Booking;
	index: number;
	newOpenBookings: OpenBookings[];
};
export const reserveSlotAsync = createAsyncThunk(
	"parkingSlot/reserveSlot",
	async ({ newSlots, newBooking, index, newOpenBookings }: ReserveProps) => {
		await Promise.all([setSlots(newSlots), addBooking(newBooking)]);
		return { index, newOpenBookings, newBooking };
	}
);

type FreeSlotProps = {
	newSlots: boolean[];
	updatedBooking: Booking;
	slotIndex: number;
	newOpenBookings: OpenBookings[];
};
export const freeSlotAsync = createAsyncThunk(
	"parkingSlot/freeSlot",
	async ({
		newSlots,
		updatedBooking,
		slotIndex,
		newOpenBookings,
	}: FreeSlotProps) => {
		await Promise.all([setSlots(newSlots), updateBooking(updatedBooking)]);
		return {
			slotIndex,
			updatedBooking,
			newOpenBookings,
		};
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
				state.openBookings = action.payload.openBookings;
				state.bookings = action.payload.bookings;
				state.bills = action.payload.bills;
			})
			.addCase(initializeFromDB.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message ?? "Failed to initialize from DB";
			})
			.addCase(initializeSlotsAsync.fulfilled, (state, action) => {
				state.slots = action.payload.slots;
				state.openBookings = action.payload.openBookings;
			})
			.addCase(reserveSlotAsync.fulfilled, (state, action) => {
				state.slots[action.payload.index] = true;
				state.openBookings = action.payload.newOpenBookings;
				state.bookings.push(action.payload.newBooking);
			})
			.addCase(freeSlotAsync.fulfilled, (state, action) => {
				state.slots[action.payload.slotIndex] = false;
				state.openBookings = action.payload.newOpenBookings;
				const index = state.bookings.findIndex(
					(r) => r.id === action.payload.updatedBooking.id
				);
				if (index !== -1) {
					state.bookings[index] = action.payload.updatedBooking;
				}
			});
	},
});

export default parkingSlotSlice.reducer;
