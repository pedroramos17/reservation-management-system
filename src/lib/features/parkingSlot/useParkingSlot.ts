import { useCallback, useEffect } from "react";
import {
	reserveSlotAsync,
	freeSlotAsync,
	initializeFromDB,
	getSlotsAsync,
} from "./parkingSlotSlice";
import { useAppDispatch, useAppSelector } from "@/lib/common/hooks/hooks";
import { Booking } from "@/lib/db/idb";

export function useParkingSlot() {
	const dispatch = useAppDispatch();
	const { slots, openBookings, bookings, bills, status, error } =
		useAppSelector((state) => state.parkingSlot);

	useEffect(() => {
		dispatch(initializeFromDB());
	}, [dispatch]);

	const reserve = useCallback(
		(vehicleId: string) => {
			const index = slots.findIndex((isReserved) => !isReserved);
			if (index !== -1) {
				const newSlots = [...slots];
				newSlots[index] = true;
				const newOpenBookings = [
					...openBookings,
					{
						slotIndex: index,
						vehicleId: vehicleId,
					},
				];

				const newBooking: Booking = {
					id: Date.now().toString(),
					vehicleId,
					slotIndex: index,
					entryDate: new Date().getTime(),
					exitDate: null,
				};
				dispatch(
					reserveSlotAsync({
						newSlots,
						newBooking,
						index,
						newOpenBookings,
					})
				);
			}
		},
		[dispatch, slots, openBookings]
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
