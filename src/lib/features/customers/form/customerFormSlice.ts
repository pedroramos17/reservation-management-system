import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: {
		name: "",
		email: "",
		taxpayerRegistration: "",
		phone: "",
		vehicles: [
			{
				brand: "",
				model: "",
				year: "",
				color: "",
				variant: "",
				licensePlate: "",
			},
		],
	},
	loading: false,
	error: null,
};
const customerFormSlice = createSlice({
	name: "customerForm",
	initialState,
	reducers: {
		submitForm: (state, action) => {
			state.loading = true;
		},
		submitFormSuccess: (state, action) => {
			state.loading = false;
			state.data = action.payload;
		},
		submitFormFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { submitForm, submitFormSuccess, submitFormFailure } =
	customerFormSlice.actions;
export default customerFormSlice.reducer;
