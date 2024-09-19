import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import propertyReducer from "@/lib/features/properties/propertySlice";
import bookingReducer from "@/lib/features/bookings/bookingSlice";
import customersReducer from "@/lib/features/customers/customersSlice";
import vehicleReducer from "@/lib/features/vehicles/vehiclesSlice";
import orderReducer from "@/lib/features/orders/orderSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			properties: propertyReducer,
			bookings: bookingReducer,
			customers: customersReducer,
			vehicles: vehicleReducer,
			orders: orderReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
