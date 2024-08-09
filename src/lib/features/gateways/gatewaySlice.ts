import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";

// const getGateways = createAsyncThunk("gateway/getAll", async () => {
// 	const gateways = await getStoreData<Gateway>(Stores.Gateways);
// 	return gateways;
// });

// const addGateway = createAsyncThunk("gateway/add", async (data: Gateway) => {
// 	return (await addData<Gateway>(Stores.Gateways, data)) as Gateway;
// });

// const deleteGateway = createAsyncThunk("gateway/delete", async (id: string) => {
// 	return await deleteData(Stores.Gateways, id);
// });

// export const gatewaysAdapter = createEntityAdapter<Gateway>();

// type Loading = "idle" | "pending" | "succeeded" | "failed";

// const initialState = gatewaysAdapter.getInitialState({
// 	loading: "idle" as Loading,
// 	error: null as string | null,
// });

// export const gatewaySlice = createSlice({
// 	name: "gateways",
// 	initialState,
// 	reducers: {},
// 	extraReducers: (builder) => {
// 		builder
// 			.addCase(getGateways.pending, (state) => {
// 				state.loading = "pending";
// 				state.error = null;
// 			})
// 			.addCase(getGateways.fulfilled, (state, { payload }) => {
// 				state.loading = "succeeded";
// 				gatewaysAdapter.upsertMany(state, payload);
// 			})
// 			.addCase(getGateways.rejected, (state, action) => {
// 				state.loading = "failed";
// 				state.error = action.error.message ?? "Failed to get gateways";
// 			})
// 			.addCase(addGateway.pending, (state) => {
// 				state.loading = "pending";
// 				state.error = null;
// 			})
// 			.addCase(addGateway.fulfilled, (state, { payload }) => {
// 				state.loading = "succeeded";
// 				gatewaysAdapter.addOne(state, payload);
// 			})
// 			.addCase(addGateway.rejected, (state, action) => {
// 				state.loading = "failed";
// 				state.error = action.error.message ?? "Failed to add gateway";
// 			})
// 			.addCase(deleteGateway.pending, (state) => {
// 				state.loading = "pending";
// 				state.error = null;
// 			})
// 			.addCase(deleteGateway.fulfilled, (state, { payload }) => {
// 				state.loading = "succeeded";
// 				gatewaysAdapter.removeOne(state, payload);
// 			})
// 			.addCase(deleteGateway.rejected, (state, action) => {
// 				state.loading = "failed";
// 				state.error =
// 					action.error.message ?? "Failed to delete gateway";
// 			});
// 	},
// });

// const { reducer } = gatewaySlice;
// export { getGateways, addGateway, deleteGateway };
// export default reducer;
