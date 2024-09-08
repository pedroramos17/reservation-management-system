import { useCallback, useEffect } from "react";
import {
	reserveSlotAsync,
	freeSlotAsync,
	initializeFromDB,
	createOrderAsync,
} from "./bookingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Order, Booking, ChargeByType } from "@/lib/db/idb";
import chargingStrategy from "./chargingStrategy";

export function useBookingSlot() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(initializeFromDB());
	}, [dispatch]);

	const { slots, openBookings, bookings } = useAppSelector(
		(state) => state.bookings
	);
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
					const closedBooking = {
						...booking,
						exitDate: new Date().getTime(),
					};

					dispatch(
						freeSlotAsync({
							newSlots,
							closedBooking,
							slotIndex,
							newOpenBookings,
						})
					);
					return closedBooking;
				}
			}
		},
		[dispatch, slots, openBookings, bookings]
	);
	const convertMillisecondsToMinutes = (milliseconds: number) =>
		Math.floor(milliseconds / (1000 * 60));
	const howLongItTookForTheVehicleToLeaveInMinutes = useCallback(
		(entryDate: number, exitDate: number) => {
			return convertMillisecondsToMinutes(exitDate - entryDate);
		},
		[]
	);

	const chargingSelector = (
		minutes: number,
		chargeBy: ChargeByType,
		chargeAmount: number
	) => {
		const {
			lessThanTenMinutes,
			halfHourCharging,
			hourlyCharging,
			dailyCharging,
			monthlyCharging,
			noneChargingType,
		} = chargingStrategy(minutes);
		const selectChargeMethod = (chargeBy: ChargeByType) => {
			switch (chargeBy) {
				case "none":
					return noneChargingType();
				case "less-than-10-minutes":
					return lessThanTenMinutes(chargeAmount);
				case "half-hour":
					return halfHourCharging(chargeAmount);
				case "hour":
					return hourlyCharging(chargeAmount);
				case "day":
					return dailyCharging(chargeAmount);
				case "month":
					return monthlyCharging(chargeAmount);
				default:
					return noneChargingType();
			}
		};
		return selectChargeMethod(chargeBy);
	};

	interface OrderProps {
		bookingId: string;
		timeSpentInMinutes: number;
		chargeBy: ChargeByType;
		price: number;
	}
	const createOrder = (props: OrderProps) => {
		const { bookingId, timeSpentInMinutes, chargeBy, price } = props;
		const booking = bookings.find((b) => b.id === bookingId);
		if (!booking) {
			return { message: "Booking not found", error: true };
		}
		const order: Order = {
			id: Date.now().toString(),
			bookingId,
			minutes: timeSpentInMinutes,
			chargeBy,
			price,
		};
		dispatch(createOrderAsync(order));
		return order.id;
	};

	return {
		reserveSlot: reserve,
		freeSlot: free,
		howLongItTookForTheVehicleToLeaveInMinutes,
		createOrder,
		chargingSelector,
	};
}
