import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
import {
	add,
	update,
	getAll,
	remove,
} from "@/lib/repositories/vehicleRepository";
import type { Vehicle } from "@/lib/db/idb";
import { AtLeastOne } from "../utils";

type AtLeastOneVehicleField = AtLeastOne<Vehicle>;

const getVehicles = createAsyncThunk("vehicle/getAll", async () => {
	const vehicles = await getAll();
	return vehicles;
});

const addVehicle = createAsyncThunk("vehicle/add", async (data: Vehicle) => {
	return await add(data);
});

const updateVehicle = createAsyncThunk(
	"vehicle/update",
	async (updatedData: AtLeastOneVehicleField & { id: string }) => {
		return (await update(updatedData)) as AtLeastOneVehicleField;
	}
);

const deleteVehicle = createAsyncThunk("vehicle/delete", async (id: string) => {
	await remove(id);
	return id;
});

export const vehiclesAdapter = createEntityAdapter({
	selectId: (vehicle: Vehicle) => vehicle.licensePlate,
});

type Loading = "idle" | "pending" | "succeeded" | "failed";

const initialState = vehiclesAdapter.getInitialState({
	loading: "idle" as Loading,
	error: null as string | null,
});

export const vehicleSlice = createSlice({
	name: "vehicles",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getVehicles.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(getVehicles.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				vehiclesAdapter.upsertMany(state, payload);
			})
			.addCase(getVehicles.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to get vehicles";
			})
			.addCase(addVehicle.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(addVehicle.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				vehiclesAdapter.addOne(state, payload);
			})
			.addCase(addVehicle.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to add vehicle";
			})
			.addCase(updateVehicle.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(updateVehicle.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				const { id, ...changes } = payload;
				if (id) {
					vehiclesAdapter.updateOne(state, { id, changes });
				} else {
					state.error = "Failed to update vehicle, id not found";
				}
			})
			.addCase(updateVehicle.rejected, (state, action) => {
				state.loading = "failed";
				state.error =
					action.error.message ?? "Failed to update vehicle";
			})
			.addCase(deleteVehicle.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(deleteVehicle.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				vehiclesAdapter.removeOne(state, payload);
			})
			.addCase(deleteVehicle.rejected, (state, action) => {
				state.loading = "failed";
				state.error =
					action.error.message ?? "Failed to delete vehicle";
			});
	},
});

const { reducer } = vehicleSlice;
export { getVehicles, addVehicle, updateVehicle, deleteVehicle };
export default reducer;
