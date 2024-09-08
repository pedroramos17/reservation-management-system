import {
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
	createSlice,
	EntityState,
} from "@reduxjs/toolkit";
import {
	getCustomers,
	setCustomer,
	removeCustomer,
} from "@/lib/repositories/customerRepository";
import type { Customer } from "@/lib/db/idb";
import { RootState } from "@/lib/store";
import { selectAllVehicles } from "../vehicles/vehiclesSlice";

interface CustomersState extends EntityState<Customer, string> {
	status: "idle" | "pending" | "succeeded" | "rejected";
	error: string | null;
}

const customersAdapter = createEntityAdapter<Customer>();

const initialState: CustomersState = customersAdapter.getInitialState({
	status: "idle",
	error: null,
});

const getCustomersAsync = createAsyncThunk(
	"customer/getCustomers",
	async () => {
		const customers = await getCustomers();
		return customers;
	}
);

const setCustomerAsync = createAsyncThunk(
	"customer/setCustomer",
	async (customer: Customer) => {
		await setCustomer(customer);
		return customer;
	}
);

const deleteCustomerAsync = createAsyncThunk(
	"customer/delete",
	async (customerId: string) => {
		await removeCustomer(customerId);
		return customerId;
	}
);

export const customerSlice = createSlice({
	name: "customers",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCustomersAsync.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(getCustomersAsync.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				customersAdapter.upsertMany(state, payload);
			})
			.addCase(getCustomersAsync.rejected, (state, action) => {
				state.status = "rejected";
				state.error =
					action.error.message ?? "Rejected to get customers";
			})
			.addCase(setCustomerAsync.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(setCustomerAsync.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				customersAdapter.upsertOne(state, payload);
			})
			.addCase(setCustomerAsync.rejected, (state, action) => {
				state.status = "rejected";
				state.error =
					action.error.message ?? "Rejected to add customer";
			})
			.addCase(deleteCustomerAsync.pending, (state) => {
				state.status = "pending";
				state.error = null;
			})
			.addCase(deleteCustomerAsync.fulfilled, (state, { payload }) => {
				state.status = "succeeded";
				customersAdapter.removeOne(state, payload);
			})
			.addCase(deleteCustomerAsync.rejected, (state, action) => {
				state.status = "rejected";
				state.error =
					action.error.message ?? "Rejected to delete customer";
			});
	},
});

export { getCustomersAsync, setCustomerAsync, deleteCustomerAsync };
export default customerSlice.reducer;

export const {
	selectAll: selectAllCustomers,
	selectById: selectCustomerById,
	selectIds: selectCustomerIds,
} = customersAdapter.getSelectors((state: RootState) => state.customers);

export const selectVehiclesByCustomerId = createSelector(
	[
		(state: RootState) => selectAllVehicles(state),
		(state: RootState, customerId: string) =>
			selectCustomerById(state, customerId)?.id,
	],
	(vehicles, customerId) => {
		return vehicles.filter((vehicle) => vehicle.customerId === customerId);
	}
);
