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
	deleteBooking,
} from "@/lib/repositories/bookingRepository";
import { RootState } from "@/lib/store";
interface OpenBookings {
	slotIndex: number;
	vehicleId: string | null;
}

const bookingAdapter = createEntityAdapter<Booking>();
interface BookingState {
	slots: boolean[];
	openBookings: OpenBookings[];
	bookings: EntityState<Booking, string>;
	status: "idle" | "loading" | "failed";
	error: string | null;
}
const initialState: BookingState = {
	slots: [],
	openBookings: [],
	bookings: bookingAdapter.getInitialState(),
	status: "idle",
	error: null,
};

export const getBookingsAsync = createAsyncThunk(
	"booking/getBookingsAsync",
	async () => {
		const [slots, openBookings, bookings] = await Promise.all([
			getSlots(),
			getOpenBookings(),
			getBookings(),
		]);
		console.log("getBookingsAsync", slots, openBookings, bookings);
		return {
			slots,
			openBookings,
			bookings,
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
		await setSlots(slots);
		return slots;
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

export const bookingSlice = createSlice({
	name: "booking",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getBookingsAsync.pending, (state) => {
				state.status = "loading";
			})
			.addCase(getBookingsAsync.fulfilled, (state, action) => {
				state.status = "idle";
				state.slots = action.payload.slots;
				state.openBookings = action.payload.openBookings;
				bookingAdapter.upsertMany(
					state.bookings,
					action.payload.bookings
				);
			})
			.addCase(getBookingsAsync.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message ?? "Failed to initialize from DB";
			})
			.addCase(initializeSlotsAsync.fulfilled, (state, action) => {
				state.slots = action.payload;
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
			});
	},
});

export default bookingSlice.reducer;

export const {
	selectAll: selectAllBookings,
	selectById: selectBookingById,
	selectIds: selectBookingIds,
} = bookingAdapter.getSelectors((state: RootState) => state.bookings.bookings);
