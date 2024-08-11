import { useCallback, useEffect } from "react";
import {
	reserveSlotAsync,
	freeSlotAsync,
	initializeFromDB,
} from "./parkingSlotSlice";
import { useAppDispatch } from "@/lib/common/hooks/hooks";

export function useParkingSlot() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initializeFromDB());
	}, [dispatch]);

	const reserve = useCallback(
		(vehicleId: string) => {
			dispatch(reserveSlotAsync({ vehicleId }));
		},
		[dispatch]
	);

	const free = useCallback(
		(slotIndex: number) => {
			return dispatch(freeSlotAsync(slotIndex));
		},
		[dispatch]
	);

	return {
		reserveSlot: reserve,
		freeSlot: free,
	};
}
