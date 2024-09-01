import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import parkingSlotReducer from "@/lib/features/parkingSlot/parkingSlotSlice";
import customersReducer from "@/lib/features/customers/customersSlice";
import vehicleReducer from "@/lib/features/vehicles/vehicleSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			parkingSlot: parkingSlotReducer,
			customers: customersReducer,
			vehicles: vehicleReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
