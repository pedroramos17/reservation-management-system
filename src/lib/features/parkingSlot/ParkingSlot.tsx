'use client';

import React, { useEffect, useState } from 'react';
import { useParkingSlot } from './useParkingSlot';
import { freeSlotAsync, initializeSlotsAsync, reserveSlotAsync } from './parkingSlotSlice';
import { useAppDispatch, useAppSelector } from '@/lib/common/hooks/hooks';
import Toast from '@/lib/common/components/Toast';

export default function ParkingSlotPage() {
  const dispatch = useAppDispatch();
  const { slots, openBookings, bookings, status, error } =
  useAppSelector((state) => state.parkingSlot);
  const { reserveSlot, freeSlot } = useParkingSlot();
  const [vehicleId, setVehicleId] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState(0);

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
        const { slotIndex, updatedBooking } = resultAction.payload;
        const duration = new Date(updatedBooking.exitDate!).getTime() - new Date(updatedBooking.entryDate).getTime();
        const durationInMinutes = Math.round(duration / 60000);
        console.log(`Slot ${slotIndex} freed. Vehicle ${updatedBooking.vehicleId} stayed for ${durationInMinutes} minutes.`);
        setDurationInMinutes(durationInMinutes);
      } else {
        <Toast toastMessage='Failed to free slot' />
      }
    } catch (err) {
      console.error('Error freeing slot:', err);
    }
  };
  

  const formatDate = (dateString: string | Date | null) => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
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
          const { hours, minutes, cost } = calculateDurationAndCost(booking.entryDate, booking.exitDate);
          return (
            <li key={booking.id}>
              Vehicle: {booking.vehicleId}, 
              Slot: {booking.slotIndex}, 
              Entry: {formatDate(booking.entryDate)}, 
              Exit: {formatDate(booking.exitDate)},
              Duration: {hours}h {minutes}m,
              Cost: ${cost.toFixed(2)}
            </li>
          )
        } )}
      </ul>
    </div>
  );
}

const calculateDurationAndCost = (entryDate: Date, exitDate: Date | null) => {
  const entry = new Date(entryDate);
  const exit = exitDate ? new Date(exitDate) : new Date();
  const durationMs = exit.getTime() - entry.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Assuming a rate of $2 per hour, with a minimum of 1 hour
  const cost = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60))) * 2;
  
  return { hours, minutes, cost };
};


const calculateDurationInMinutes = (entryDate: Date, exitDate: Date | null) => {
  return exitDate ? Math.round((exitDate.getTime() - entryDate.getTime()) / 60000) : entryDate.getTime() - new Date().getTime();
};

