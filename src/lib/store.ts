import { configureStore } from "@reduxjs/toolkit";
import driverReducer from "./features/drivers/driversSlice";
import gatewayReducer from "./features/gateways/gatewaySlice";
export const makeStore = () => {
	return configureStore({
		reducer: {
			drivers: driverReducer,
			gateways: gatewayReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
