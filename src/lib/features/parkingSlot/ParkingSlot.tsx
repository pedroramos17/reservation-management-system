// src/components/ParkingSlotPage.tsx
import React, { useState } from 'react';
import { useParSlotMap } from './useParkingSlot';

function ParkingSlotPage() {
  const { reserveSlot, freeSlot, getSlots, getReservationHistory } = useParSlotMap(10);
  const [vehicleId, setVehicleId] = useState('');

  const handleReserve = () => {
    if (vehicleId) {
      const reserved = reserveSlot(vehicleId);
      if (reserved !== null) {
        console.log(`Slot ${reserved} reserved for vehicle ${vehicleId}`);
        setVehicleId('');
      } else {
        console.log('No slots available');
      }
    } else {
      console.log('Please enter a vehicle ID');
    }
  };

  const handleFree = (index: number) => {
    const freed = freeSlot(index);
    if (freed) {
      const { vehicleId, duration } = freed;
      const durationInMinutes = Math.round(duration / 60000);
      console.log(`Slot ${index} freed. Vehicle ${vehicleId} stayed for ${durationInMinutes} minutes.`);
    } else {
      console.log(`Slot ${index} was not reserved`);
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
      {getSlots().map((slot, index) => (
        <div key={index}>
          <button onClick={() => handleFree(index)} disabled={!slot.isReserved}>
            {slot.isReserved 
              ? `Free Slot ${index} (Vehicle: ${slot.vehicleId})` 
              : `Slot ${index} (Free)`}
          </button>
        </div>
      ))}
      <h3>Reservation History</h3>
      <ul>
        {getReservationHistory().map((reservation) => (
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

export default ParkingSlotPage;