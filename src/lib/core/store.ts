import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "@/lib/features/customer/customersSlice";
import parkingSlotReducer from "@/lib/features/parkingSlot/parkingSlotSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			customers: customerReducer,
			parkingSlot: parkingSlotReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
