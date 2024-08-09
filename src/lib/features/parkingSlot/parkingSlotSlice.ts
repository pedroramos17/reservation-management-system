// src/features/parSlotMap/parSlotMapSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reservation {
	id: string;
	vehicleId: string;
	slotIndex: number;
	entryDate: string;
	exitDate: string | null;
}

interface ParSlotMapState {
	slots: boolean[];
	currentReservations: Record<number, string | null>;
	reservationHistory: Reservation[];
}

const initialState: ParSlotMapState = {
	slots: [],
	currentReservations: {},
	reservationHistory: [],
};

export const parkingSlotSlice = createSlice({
	name: "parkingSlot",
	initialState,
	reducers: {
		initializeSlots: (state, action: PayloadAction<number>) => {
			state.slots = new Array(action.payload).fill(false);
			state.currentReservations = {};
		},
		reserveSlot: (state, action: PayloadAction<{ vehicleId: string }>) => {
			const index = state.slots.findIndex((isReserved) => !isReserved);
			if (index !== -1) {
				state.slots[index] = true;
				state.currentReservations[index] = action.payload.vehicleId;
				const newReservation: Reservation = {
					id: Date.now().toString(), // Simple unique ID generation
					vehicleId: action.payload.vehicleId,
					slotIndex: index,
					entryDate: new Date().toISOString(),
					exitDate: null,
				};
				state.reservationHistory.push(newReservation);
			}
		},
		freeSlot: (state, action: PayloadAction<number>) => {
			const slotIndex = action.payload;
			if (state.slots[slotIndex]) {
				state.slots[slotIndex] = false;
				const vehicleId = state.currentReservations[slotIndex];
				if (vehicleId) {
					const reservation = state.reservationHistory.find(
						(r) =>
							r.vehicleId === vehicleId &&
							r.slotIndex === slotIndex &&
							r.exitDate === null
					);
					if (reservation) {
						reservation.exitDate = new Date().toISOString();
					}
					delete state.currentReservations[slotIndex];
				}
			}
		},
	},
});

export const { initializeSlots, reserveSlot, freeSlot } =
	parkingSlotSlice.actions;

export default parkingSlotSlice.reducer;
