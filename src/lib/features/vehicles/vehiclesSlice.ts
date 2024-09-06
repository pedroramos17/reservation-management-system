import { Vehicle } from "@/lib/db/idb";
import {
	getVehicles,
	setVehicles,
	removeVehicles,
} from "@/lib/repositories/vehicleRepository";
import { RootState } from "@/lib/store";
import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	EntityState,
} from "@reduxjs/toolkit";

interface VehiclesState extends EntityState<Vehicle, string> {
	status: "idle" | "pending" | "succeeded" | "rejected";
	error: string | null;
}

const vehiclesAdapter = createEntityAdapter<Vehicle>();

const initialState: VehiclesState = vehiclesAdapter.getInitialState({
	status: "idle",
	error: null,
});

const getVehiclesAsync = createAsyncThunk("vehicle/getVehicles", async () => {
	const vehicles = await getVehicles();
	console.log("getVehicles", vehicles);
	return vehicles;
});

const setVehiclesAsync = createAsyncThunk(
	"vehicle/setVehicle",
	async (vehicles: Vehicle[]) => {
		await setVehicles(vehicles);
		return vehicles;
	}
);

const deleteVehiclesAsync = createAsyncThunk(
	"vehicle/delete",
	async (vehicleIds: string[]) => {
		await removeVehicles(vehicleIds);
		return vehicleIds;
	}
);

export const vehiclesSlice = createSlice({
	name: "vehicles",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getVehiclesAsync.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(getVehiclesAsync.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				vehiclesAdapter.upsertMany(state, payload);
			})
			.addCase(getVehiclesAsync.rejected, (state, action) => {
				state.status = "rejected";
				state.error =
					action.error.message ?? "Rejected to get vehicles";
			})
			.addCase(setVehiclesAsync.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(setVehiclesAsync.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				vehiclesAdapter.upsertMany(state, payload);
			})
			.addCase(setVehiclesAsync.rejected, (state, action) => {
				state.status = "rejected";
				state.error = action.error.message ?? "Rejected to add vehicle";
			})
			.addCase(deleteVehiclesAsync.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(deleteVehiclesAsync.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				vehiclesAdapter.removeMany(state, payload);
			})
			.addCase(deleteVehiclesAsync.rejected, (state, action) => {
				state.status = "rejected";
				state.error =
					action.error.message ?? "Rejected to delete vehicle";
			});
	},
});

export { getVehiclesAsync, setVehiclesAsync, deleteVehiclesAsync };
export default vehiclesSlice.reducer;

export const {
	selectAll: selectAllVehicles,
	selectById: selectVehicleById,
	selectIds: selectVehicleIds,
	selectEntities: selectVehiclesEntities,
	selectTotal: selectVehiclesTotal,
} = vehiclesAdapter.getSelectors((state: RootState) => state.vehicles);
