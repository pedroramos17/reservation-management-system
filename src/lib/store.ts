import { configureStore } from "@reduxjs/toolkit";
import driverSlice from "./features/drivers/driversSlice";
export const makeStore = () => {
	return configureStore({
		reducer: {
			drivers: driverSlice,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
