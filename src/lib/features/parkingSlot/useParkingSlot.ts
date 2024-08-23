import { useCallback, useEffect } from "react";
import {
	reserveSlotAsync,
	freeSlotAsync,
	initializeFromDB,
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
			if (slots[slotIndex]) {
				const newSlots = [...slots];
				newSlots[slotIndex] = false;
				// Create a new object without the slotIndex property
				const newOpenBookings = [...openBookings].filter(
					(r) => r.slotIndex !== slotIndex
				);

				const vehicleId = openBookings.find(
					(r) => r.slotIndex === slotIndex
				)?.vehicleId;
				const booking = bookings.find(
					(r) =>
						r.vehicleId === vehicleId &&
						r.slotIndex === slotIndex &&
						r.exitDate === null
				);
				if (booking) {
					const updatedBooking = {
						...booking,
						exitDate: new Date().getTime(),
					};
					dispatch(
						freeSlotAsync({
							newSlots,
							updatedBooking,
							slotIndex,
							newOpenBookings,
						})
					);
				}
			}
		},
		[dispatch, slots, openBookings, bookings]
	);

	return {
		reserveSlot: reserve,
		freeSlot: free,
	};
}
