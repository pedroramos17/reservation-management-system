import { useCallback, useEffect } from "react";
import {
	reserveSlotAsync,
	freeSlotAsync,
	getBookingsAsync,
	selectAllBookings,
} from "./bookingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Order, Booking, ChargePer } from "@/lib/db/idb";
import chargingStrategy from "./chargingStrategy";
import { addOrderAsync } from "../orders/orderSlice";

export function useBookingSlot() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getBookingsAsync());
	}, [dispatch]);

	const { slots, openBookings } = useAppSelector((state) => state.bookings);
	const bookings = useAppSelector((state) => selectAllBookings(state));
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
		async (slotIndex: number) => {
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
					const closedBooking: Booking = {
						...booking,
						exitDate: new Date().getTime(),
					};

					await dispatch(
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
		chargePer: ChargePer,
		chargeAmount: number
	) => {
		const { hourlyCharge, dailyCharge, monthlyCharge, stayingCharge } =
			chargingStrategy(minutes);
		const selectChargeMethod = (chargePer: ChargePer) => {
			switch (chargePer) {
				case "hour":
					return hourlyCharge(chargeAmount);
				case "day":
					return dailyCharge(chargeAmount);
				case "month":
					return monthlyCharge(chargeAmount);
				case "stay":
					return stayingCharge(chargeAmount);
			}
		};
		return selectChargeMethod(chargePer);
	};

	interface OrderProps {
		bookingId: string;
		timeSpentInMinutes: number;
		chargePer: ChargePer;
		price: number;
	}
	const createOrder = (props: OrderProps) => {
		const { bookingId, timeSpentInMinutes, chargePer, price } = props;
		const booking = bookings.find((b) => b.id === bookingId);
		if (!booking) {
			return { message: "Booking not found", error: true };
		}
		const order: Order = {
			id: Date.now().toString(),
			bookingId,
			minutes: timeSpentInMinutes,
			chargePer,
			price,
		};
		dispatch(addOrderAsync(order));
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
