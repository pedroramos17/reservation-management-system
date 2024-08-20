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
} from "@/lib/repositories/customerRepository";
import type { Customer } from "@/lib/db/idb";
import { AtLeastOne } from "../utils";

type AtLeastOneCustomerField = AtLeastOne<Customer>;

const getCustomers = createAsyncThunk("customer/getAll", async () => {
	const customers = await getAll();
	return customers;
});

const addCustomer = createAsyncThunk("customer/add", async (data: Customer) => {
	return await add(data);
});

const updateCustomer = createAsyncThunk(
	"customer/update",
	async (updatedData: AtLeastOneCustomerField & { id: string }) => {
		return (await update(updatedData)) as AtLeastOneCustomerField;
	}
);

const deleteCustomer = createAsyncThunk(
	"customer/delete",
	async (id: string) => {
		await remove(id);
		return id;
	}
);

export const customersAdapter = createEntityAdapter<Customer>();

type Loading = "idle" | "pending" | "succeeded" | "failed";

const initialState = customersAdapter.getInitialState({
	loading: "idle" as Loading,
	error: null as string | null,
});

export const customerSlice = createSlice({
	name: "customers",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getCustomers.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(getCustomers.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				customersAdapter.upsertMany(state, payload);
			})
			.addCase(getCustomers.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to get customers";
			})
			.addCase(addCustomer.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(addCustomer.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				customersAdapter.addOne(state, payload);
			})
			.addCase(addCustomer.rejected, (state, action) => {
				state.loading = "failed";
				state.error = action.error.message ?? "Failed to add customer";
			})
			.addCase(updateCustomer.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(updateCustomer.fulfilled, (state, { payload }) => {
				state.loading = "succeeded";
				const { id, ...changes } = payload;
				if (id) {
					customersAdapter.updateOne(state, { id, changes });
				} else {
					state.error = "Failed to update customer, id not found";
				}
			})
			.addCase(updateCustomer.rejected, (state, action) => {
				state.loading = "failed";
				state.error =
					action.error.message ?? "Failed to update customer";
			})
			.addCase(deleteCustomer.pending, (state) => {
				state.loading = "pending";
				state.error = null;
			})
			.addCase(deleteCustomer.fulfilled, (state, {payload}) => {
				state.loading = "succeeded";
				customersAdapter.removeOne(state, payload);
			})
			.addCase(deleteCustomer.rejected, (state, action) => {
				state.loading = "failed";
				state.error =
					action.error.message ?? "Failed to delete customer";
			});
	},
});

const { reducer } = customerSlice;
export { getCustomers, addCustomer, updateCustomer, deleteCustomer };
export default reducer;
