import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
import { Order } from "@/lib/db/idb";
import { addOrder, getOrders } from "@/lib/repositories/bookingRepository";
import { RootState } from "@/lib/store";

export const getOrdersAsync = createAsyncThunk(
	"booking/getOrders",
	async () => {
		const orders = await getOrders();
		return orders;
	}
);

export const createOrderAsync = createAsyncThunk(
	"booking/createOrder",
	async (order: Order) => {
		await addOrder(order);

		return order;
	}
);

const OrderAdapter = createEntityAdapter<Order>();

type Loading = "idle" | "loading" | "failed";
export const orderSlice = createSlice({
	name: "order",
	initialState: OrderAdapter.getInitialState({
		status: "idle" as Loading,
		error: null as string | null,
	}),
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getOrdersAsync.pending, (state) => {
			state.status = "loading";
		});
		builder.addCase(getOrdersAsync.fulfilled, (state, action) => {
			OrderAdapter.upsertMany(state, action.payload);
			state.status = "idle";
		});
		builder.addCase(getOrdersAsync.rejected, (state) => {
			state.status = "failed";
		});
		builder.addCase(createOrderAsync.fulfilled, (state, action) => {
			OrderAdapter.addOne(state, action.payload);
		});
	},
});

export default orderSlice.reducer;

export const { selectAll: selectAllOrders } = OrderAdapter.getSelectors(
	(state: RootState) => state.orders
);
