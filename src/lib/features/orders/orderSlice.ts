import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
import { Order } from "@/lib/db/idb";
import { RootState } from "@/lib/store";
import {
	getOrders,
	addOrder,
	deleteOrder,
} from "@/lib/repositories/orderRepository";

export const getOrdersAsync = createAsyncThunk(
	"booking/getOrders",
	async () => {
		const orders = await getOrders();
		return orders;
	}
);

export const addOrderAsync = createAsyncThunk(
	"booking/addOrder",
	async (order: Order) => {
		await addOrder(order);

		return order;
	}
);

export const deleteOrderAsync = createAsyncThunk(
	"booking/deleteOrder",
	async (orderId: string) => {
		await deleteOrder(orderId);
		return orderId;
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
		builder.addCase(addOrderAsync.fulfilled, (state, action) => {
			OrderAdapter.addOne(state, action.payload);
		});
		builder.addCase(deleteOrderAsync.fulfilled, (state, action) => {
			OrderAdapter.removeOne(state, action.payload);
		});
	},
});

export default orderSlice.reducer;

export const { selectAll: selectAllOrders, selectById: selectOrderById } =
	OrderAdapter.getSelectors((state: RootState) => state.orders);
