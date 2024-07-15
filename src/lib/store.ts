import { configureStore } from "@reduxjs/toolkit";
import driverReducer from "./features/drivers/driversSlice";
export const makeStore = () => {
	return configureStore({
		reducer: {
			drivers: driverReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
