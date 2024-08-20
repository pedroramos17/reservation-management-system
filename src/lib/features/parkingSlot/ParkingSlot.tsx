'use client';

import React, { useEffect, useState } from 'react';
import { useParkingSlot } from './useParkingSlot';
import { freeSlotAsync, initializeSlotsAsync, reserveSlotAsync } from './parkingSlotSlice';
import { useAppDispatch, useAppSelector } from '@/lib/common/hooks/hooks';
import Toast from '@/lib/common/components/Toast';

export default function ParkingSlotPage() {
  const dispatch = useAppDispatch();
  const { slots, openReservations, reservations, status, error } =
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
        const { slotIndex, updatedReservation } = resultAction.payload;
        const duration = new Date(updatedReservation.exitDate!).getTime() - new Date(updatedReservation.entryDate).getTime();
        const durationInMinutes = Math.round(duration / 60000);
        console.log(`Slot ${slotIndex} freed. Vehicle ${updatedReservation.vehicleId} stayed for ${durationInMinutes} minutes.`);
      } else {
        <Toast toastMessage='Failed to free slot' />
      }
    } catch (err) {
      console.error('Error freeing slot:', err);
    }
  };
  

  const formatDate = (dateString: string | null) => {
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
              ? `Free Slot ${index} (Vehicle: ${openReservations.find((r) => r.slotIndex === index)?.vehicleId})` 
              : `Slot ${index} (Free)`}
          </button>
        </div>
      ))}
      <h3>Reservation History</h3>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            Vehicle: {reservation.vehicleId}, 
            Slot: {reservation.slotIndex}, 
            Entry: {formatDate(reservation.entryDate)}, 
            Exit: {formatDate(reservation.exitDate)}
          </li>
        ))}
      </ul>
    </div>
  );
}