import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from "@reduxjs/toolkit";
import {
	getStoreData,
	addData,
	updateData,
	Stores,
	deleteData,
	Driver,
} from "@/lib/utils/db";

interface DriversState {
	entities: {} | Driver[];
	ids: string[];
	loading: "idle" | "pending" | "succeeded" | "failed";
	error: string | null;
}

type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
	? K extends string
		? Pick<T, K & keyof T> & Partial<T>
		: never
	: never;

type AtLeastOneDriverField = AtLeastOne<Driver>;

const getDrivers = createAsyncThunk("driver/getAll", async () => {
	const drivers = await getStoreData<Driver>(Stores.Drivers);
	return drivers;
});

const addDriver = createAsyncThunk("driver/add", async (data: Driver) => {
	return (await addData<Driver>(Stores.Drivers, data)) as Driver;
});

const updateDriver = createAsyncThunk(
	"driver/update",
	async (updatedData: AtLeastOneDriverField & { id: string }) => {
		return (await updateData(
			Stores.Drivers,
			updatedData.id,
			updatedData
		)) as AtLeastOneDriverField;
	}
);

const deleteDriver = createAsyncThunk("driver/delete", async (id: string) => {
	return await deleteData(Stores.Drivers, id);
});

export const driversAdapter = createEntityAdapter<Driver>();

type Loading = "idle" | "pending" | "succeeded" | "failed";

const initialState = driversAdapter.getInitialState({
	loading: "idle" as Loading,
	error: null as string | null,
});

export const driverSlice = createSlice({
	name: "drivers",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getDrivers.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(getDrivers.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				driversAdapter.upsertMany(state, payload);
			})
			.addCase(getDrivers.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to get drivers";
			})
			.addCase(addDriver.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(addDriver.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				driversAdapter.addOne(state, payload);
			})
			.addCase(addDriver.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to add driver";
			})
			.addCase(updateDriver.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(updateDriver.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				const { id, ...changes } = payload;
				if (id) {
					driversAdapter.updateOne(state, { id, changes });
				} else {
					state.error = "Failed to update driver, id not found";
				}
			})
			.addCase(updateDriver.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to update driver";
			})
			.addCase(deleteDriver.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(deleteDriver.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				driversAdapter.removeOne(state, payload);
			})
			.addCase(deleteDriver.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to delete driver";
			});
	},
});

const { reducer } = driverSlice;
export { getDrivers, addDriver, updateDriver, deleteDriver };
export default reducer;
