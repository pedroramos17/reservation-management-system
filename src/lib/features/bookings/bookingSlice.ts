import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	EntityState,
} from "@reduxjs/toolkit";
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
	deleteBooking,
} from "@/lib/repositories/bookingRepository";
interface OpenBookings {
	slotIndex: number;
	vehicleId: string | null;
}

const bookingAdapter = createEntityAdapter<Booking>();
interface BookingState {
	slots: boolean[];
	openBookings: OpenBookings[];
	bookings: EntityState<Booking, string>;
	orders: Order[];
	status: "idle" | "loading" | "failed";
	error: string | null;
}
const initialState: BookingState = {
	slots: [],
	openBookings: [],
	bookings: bookingAdapter.getInitialState(),
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

export const deleteBookingAsync = createAsyncThunk(
	"booking/deleteBooking",
	async ({
		id,
		newSlots,
		newOpenBookings,
	}: {
		id: string;
		newSlots: boolean[];
		newOpenBookings: OpenBookings[];
	}) => {
		await Promise.all([setSlots(newSlots), deleteBooking(id)]);
		return { id, newSlots, newOpenBookings };
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
				bookingAdapter.upsertMany(
					state.bookings,
					action.payload.bookings
				);
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
				bookingAdapter.addOne(
					state.bookings,
					action.payload.newBooking
				);
			})
			.addCase(freeSlotAsync.fulfilled, (state, action) => {
				state.slots[action.payload.slotIndex] = false;
				state.openBookings = action.payload.newOpenBookings;
				bookingAdapter.upsertOne(
					state.bookings,
					action.payload.closedBooking
				);
			})
			.addCase(deleteBookingAsync.fulfilled, (state, action) => {
				state.openBookings = action.payload.newOpenBookings;
				state.slots = action.payload.newSlots;
				bookingAdapter.removeOne(state.bookings, action.payload.id);
			})
			.addCase(createOrderAsync.fulfilled, (state, action) => {
				state.orders.push(action.payload);
			});
	},
});

export default bookingSlice.reducer;
