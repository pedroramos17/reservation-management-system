'use client';

import React, { useEffect, useState } from 'react';
import { useParkingSlot } from './useParkingSlot';
import { freeSlotAsync, initializeSlotsAsync, reserveSlotAsync } from './parkingSlotSlice';
import { useAppDispatch, useAppSelector } from '@/lib/common/hooks/hooks';
import Toast from '@/lib/common/components/Toast';

export default function ParkingSlotPage() {
  const dispatch = useAppDispatch();
  const { slots, openBookings, bookings, bills, status, error } =
  useAppSelector((state) => state.parkingSlot);
  const { reserveSlot, freeSlot } = useParkingSlot();
  const [vehicleId, setVehicleId] = useState('');

  useEffect(() => {
		dispatch(initializeSlotsAsync(10));
	}, [dispatch]);

  const handleReserve = async () => {
    if (vehicleId) {
      try {
        const resultAction = await reserveSlot(vehicleId);
        if (reserveSlotAsync.fulfilled.match(resultAction)) {
          console.log(`Slot ${resultAction.payload.index} reserved for vehicle ${vehicleId}`);
          setVehicleId('');
        } else {
          console.log('Failed to reserve slot');
          <Toast toastMessage='Failed to reserve slot' />;
        }
      } catch (err) {
        console.error('Error reserving slot:', err);
      }
    };
  }
  const handleFree = async (index: number) => {
    try {
      const resultAction = await freeSlot(index);
      if (freeSlotAsync.fulfilled.match(resultAction)) {
      } else {
        <Toast toastMessage='Failed to free slot' />
      }
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
      {bills && (
        <div>
          <h3>Current Bills</h3>
          <ul>
            {
              bills.map((bill) => (
                <li key={bill.bookingId}>
                  Duration: {bill.minutes}h {bill.minutes}m, 
                  Total cost: ${bill.price.toFixed(2)}
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}
