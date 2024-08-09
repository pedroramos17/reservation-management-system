import { useCallback, useEffect } from "react";
import { initializeSlots, reserveSlot, freeSlot } from "./parkingSlotSlice";
import { useAppDispatch, useAppSelector } from "@/lib/common/hooks/hooks";

export function useParSlotMap(initialSlotCount: number) {
	const dispatch = useAppDispatch();
	const slots = useAppSelector((state) => state.parkingSlot.slots);
	const currentReservations = useAppSelector(
		(state) => state.parkingSlot.currentReservations
	);
	const reservationHistory = useAppSelector(
		(state) => state.parkingSlot.reservationHistory
	);

	useEffect(() => {
		dispatch(initializeSlots(initialSlotCount));
	}, [dispatch, initialSlotCount]);

	const reserve = useCallback(
		(vehicleId: string): number | null => {
			const index = slots.findIndex((isReserved) => !isReserved);
			if (index !== -1) {
				dispatch(reserveSlot({ vehicleId }));
				return index;
			}
			return null;
		},
		[dispatch, slots]
	);

	const free = useCallback(
		(slotIndex: number): { vehicleId: string; duration: number } | null => {
			const vehicleId = currentReservations[slotIndex];
			if (vehicleId) {
				const reservation = reservationHistory.find(
					(r) =>
						r.vehicleId === vehicleId &&
						r.slotIndex === slotIndex &&
						r.exitDate === null
				);
				dispatch(freeSlot(slotIndex));
				if (reservation) {
					const duration =
						new Date().getTime() -
						new Date(reservation.entryDate).getTime();
					return { vehicleId, duration };
				}
			}
			return null;
		},
		[dispatch, currentReservations, reservationHistory]
	);

	const getSlots = useCallback(
		() =>
			slots.map((isReserved, index) => ({
				isReserved,
				vehicleId: currentReservations[index] || null,
			})),
		[slots, currentReservations]
	);

	const getReservationHistory = useCallback(
		() => reservationHistory,
		[reservationHistory]
	);

	return {
		reserveSlot: reserve,
		freeSlot: free,
		getSlots,
		getReservationHistory,
	};
}
