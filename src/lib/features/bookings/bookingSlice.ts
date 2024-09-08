import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Booking, Order } from "@/lib/db/idb";
import {
	addBooking,
	getOpenBookings,
	getBookings,
	getSlots,
	updateBooking,
	setSlots,
	addOrder,
	getOrders,
} from "@/lib/repositories/bookingRepository";
interface OpenBookings {
	slotIndex: number;
	vehicleId: string | null;
}
interface BookingState {
	slots: boolean[];
	openBookings: OpenBookings[];
	bookings: Booking[];
	orders: Order[];
	status: "idle" | "loading" | "failed";
	error: string | null;
}
const initialState: BookingState = {
	slots: [],
	openBookings: [],
	bookings: [],
	orders: [],
	status: "idle",
	error: null,
};

export const initializeFromDB = createAsyncThunk(
	"booking/initializeFromDB",
	async () => {
		const [slots, openBookings, bookings, orders] = await Promise.all([
			getSlots(),
			getOpenBookings(),
			getBookings(),
			getOrders(),
		]);
		console.log("initializeFromDB", slots, openBookings, bookings, orders);
		return {
			slots,
			openBookings,
			bookings,
			orders,
		};
	}
);

export const initializeSlotsAsync = createAsyncThunk(
	"booking/initializeSlots",
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
	"booking/reserveSlot",
	async ({ newSlots, newBooking, index, newOpenBookings }: ReserveProps) => {
		await Promise.all([setSlots(newSlots), addBooking(newBooking)]);
		return { index, newOpenBookings, newBooking };
	}
);

type FreeSlotProps = {
	newSlots: boolean[];
	closedBooking: Booking;
	slotIndex: number;
	newOpenBookings: OpenBookings[];
};
export const freeSlotAsync = createAsyncThunk(
	"booking/freeSlot",
	async ({
		newSlots,
		closedBooking,
		slotIndex,
		newOpenBookings,
	}: FreeSlotProps) => {
		await Promise.all([setSlots(newSlots), updateBooking(closedBooking)]);
		return {
			slotIndex,
			closedBooking,
			newOpenBookings,
		};
	}
);

export const createOrderAsync = createAsyncThunk(
	"booking/createOrder",
	async (order: Order) => {
		await addOrder(order);

		return order;
	}
);

export const bookingSlice = createSlice({
	name: "booking",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(initializeFromDB.pending, (state) => {
				state.status = "loading";
			})
			.addCase(initializeFromDB.fulfilled, (state, action) => {
				state.status = "idle";
				state.slots = action.payload.slots;
				state.openBookings = action.payload.openBookings;
				state.bookings = action.payload.bookings;
				state.orders = action.payload.orders;
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
					(r) => r.id === action.payload.closedBooking.id
				);
				if (index !== -1) {
					state.bookings[index] = action.payload.closedBooking;
				}
			})
			.addCase(createOrderAsync.fulfilled, (state, action) => {
				state.orders.push(action.payload);
			});
	},
});

export default bookingSlice.reducer;
