import {
	getStoreData,
	addData,
	updateData,
	Stores,
	deleteData,
} from "@/lib/utils/db";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataProps {
	id: string;
	updatedAt: string;
	createdAt: string;
}

export interface Vehicle extends DataProps {
	brand: string;
	model: string;
	year: number;
	color: string;
	plate: string;
}

export interface Driver extends DataProps {
	name: string;
	rg: string;
	phone: string;
	vehicles: Vehicle[];
}
interface StateProps {
	loading: boolean;
	error: string | null;
}
interface DriverState extends StateProps {
	drivers: Record<string, Driver>[];
}

const drivers = createAsyncThunk("driver/getAll", async () => {
	const drivers = await getStoreData<Driver>(Stores.Drivers);
	return drivers;
});

const addDriver = createAsyncThunk("driver/add", async (data: Driver) => {
	const driverAdded = await addData<Driver>(Stores.Drivers, data);
	return driverAdded;
});

const updateDriver = createAsyncThunk(
	"driver/update",
	async (updatedData: Partial<Driver> & { id: string }) => {
		const driverUpdated = await updateData(
			Stores.Drivers,
			updatedData.id,
			updatedData
		);
		return driverUpdated;
	}
);

const deleteDriver = createAsyncThunk("driver/delete", async (id: string) => {
	const driverIdDeleted = await deleteData(Stores.Drivers, id);
	return driverIdDeleted;
});
export const driverSlice = createSlice({
	name: "driver",
	initialState: {
		drivers: {},
		loading: false,
		error: null,
	} as DriverState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(drivers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(drivers.fulfilled, (state, action) => {
				state.loading = false;
				state.drivers = action.payload.reduce(
					(drivers, driver) => {
						const { id } = driver;
						drivers = {
							...drivers,
							[id]: driver,
						};
						return drivers;
					},
					{ ...state.drivers }
				);
			})
			.addCase(drivers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? "Failed to get drivers";
			})
			.addCase(addDriver.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addDriver.fulfilled, (state, action) => {
				state.loading = false;
				if (isDriver(action.payload)) {
					const driver = action.payload;
					const { id } = driver;
					state.drivers = {
						...state.drivers,
						[id]: driver,
					};
				} else {
					state.error = "Invalid driver payload";
				}
			})
			.addCase(addDriver.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? "Failed to add driver";
			})
			.addCase(updateDriver.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateDriver.fulfilled, (state, action) => {
				state.loading = false;
				if (isDriver(action.payload)) {
					const driver = action.payload;
					const { id } = driver;
					if (isDriver(action.payload)) {
						state.drivers = {
							...state.drivers,
							[id]: {
								...driver,
							},
						};
					}
				} else {
					state.error = "Invalid driver payload";
				}
			})
			.addCase(updateDriver.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? "Failed to update driver";
			})
			.addCase(deleteDriver.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteDriver.fulfilled, (state, action) => {
				state.loading = false;
				if (isDriver(action.payload)) {
					const driver = action.payload;
					const { id } = driver;
					state.drivers = state.drivers.filter(() => !id);
				} else {
					state.error = "Invalid driver payload";
				}
			})
			.addCase(deleteDriver.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? "Failed to delete driver";
			});
	},
});

function isDriver(
	payload: string | Driver | (Partial<Driver> & { id: string }) | null
): payload is Driver {
	return payload !== null && typeof payload === "object";
}

export default driverSlice.reducer;
