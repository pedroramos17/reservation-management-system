'use client';

import React, { useEffect, useState } from 'react';
import { useParkingSlot } from './useParkingSlot';
import { initializeSlotsAsync } from './parkingSlotSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';

export default function ParkingSlotPage() {
  const dispatch = useAppDispatch();
  const { slots, openBookings, bookings, orders } =
  useAppSelector((state) => state.parkingSlot);
  const { reserveSlot, freeSlot, chargingSelector, createOrder, howLongItTookForTheVehicleToLeaveInMinutes } = useParkingSlot();
  const [vehicleId, setVehicleId] = useState('');

  useEffect(() => {
		dispatch(initializeSlotsAsync(10));
	}, [dispatch]);

  const handleReserve = async () => {
    if (vehicleId) {
      try {
            await reserveSlot(vehicleId);
            console.log(`Slot was reserved for vehicle ${vehicleId}`);
            setVehicleId('');
        } catch (err) {
        console.error('Error reserving slot:', err);
      }
    };
  }
  const handleFree = (index: number) => {
    try {
      const slotRealesed = freeSlot(index);
      if (!slotRealesed) {
        console.log(`Slot ${index} was not reserved`);
        return;
      }
      const minutesSpent = howLongItTookForTheVehicleToLeaveInMinutes(
        slotRealesed.entryDate, slotRealesed.exitDate
      )
      const chargeBy =  "hour";
      const price = chargingSelector(minutesSpent, chargeBy, 0.25);

    createOrder({
      bookingId: slotRealesed.id,
      timeSpentInMinutes: minutesSpent,
      chargeBy,
      price,
    })
      console.log(`Slot ${index} was freed`);
    } catch (err) {
      console.error('Error freeing slot:', err);
    }
  };
  
  type FormatDateType = string | number | Date | null;
  const formatDate = (date: FormatDateType) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  return (
    <div>
      <input
        type="text"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
        placeholder="Enter vehicle ID"
      />
      <button onClick={handleReserve}>Reserve Slot</button>
      {slots.map((slot, index) => (
        <div key={index}>
          <button onClick={() => handleFree(index)} disabled={!slot}>
            {slot 
              ? `Free Slot ${index} (Vehicle: ${openBookings.find((r) => r.slotIndex === index)?.vehicleId})` 
              : `Slot ${index} (Free)`}
          </button>
        </div>
      ))}
      <h3>Booking History</h3>
      <ul>
        {bookings.map((booking) => {
          return (
            <li key={booking.id}>
              Vehicle: {booking.vehicleId}, 
              Slot: {booking.slotIndex}, 
              Entry: {formatDate(booking.entryDate)}, 
              Exit: {formatDate(booking.exitDate)},
            </li>
          )
        } )}
      </ul>
      {orders && (
        <div>
          <h3>Current Orders</h3>
          <ul>
            {
              orders.map((order) => {
                const hours = Math.floor(order.minutes / 60),
                minutes = order.minutes % 60;
                return  (
                  <li key={order.bookingId}>
                    Duration: {hours}h {minutes}m, 
                    Total cost: ${order.price.toFixed(2)}
                  </li>
                )
              })
            }
          </ul>
        </div>
      )}
    </div>
  );
}
