'use client';

import React, { useEffect, useState } from 'react';
import FlexSearch from 'flexsearch';
import { useBookingSlot } from './useBookingSlot';
import { initializeSlotsAsync } from './bookingSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Vehicle } from '@/lib/db/idb';
import { getVehiclesAsync, selectAllVehicles } from '../vehicles/vehiclesSlice';

interface BookingPageProps {
  readonly query: string;
}

function fetchFilteredVehicles(query: string, vehicles: Vehicle[]|[]) {
  const VehicleDocument = new FlexSearch.Document({
    document: {
      id: 'id',
      index: ['description', 'licensePlate', 'customerId'],
    },
    charset: 'latin:advanced',
    tokenize: 'reverse',
    cache: true,
    preset: 'performance',
  })

  for (const vehicle of vehicles) {
    VehicleDocument.add({
      id: vehicle.id,
      description: vehicle.brand + ' ' + vehicle.model + ' ' + vehicle.year + ' ' + vehicle.color + ' ' + vehicle.variant,
      licensePlate: vehicle.licensePlate,
      customerId: vehicle.customerId,
    })
  }
    
  const results = VehicleDocument.search(query, { suggest: true });

  return results;
}

export default function BookingPage(props: BookingPageProps) {
  const dispatch = useAppDispatch();
  const { slots, openBookings, bookings, orders } =
  useAppSelector((state) => state.bookings);
  const vehicles = useAppSelector((state) => selectAllVehicles(state));
  const { reserveSlot, freeSlot, chargingSelector, createOrder, howLongItTookForTheVehicleToLeaveInMinutes } = useBookingSlot();
  const [vehicleId, setVehicleId] = useState('');
  const { query } = props;
  const vehiclesResponse = fetchFilteredVehicles(query, vehicles);

  let searchedVehiclesIds: any = [];
  vehiclesResponse.forEach((response) => {
    searchedVehiclesIds = response['result'];
  })

  const rows = query ? vehicles.filter((vehicle) => searchedVehiclesIds.includes(vehicle.id)) : vehicles;

  useEffect(() => {
    dispatch(getVehiclesAsync())
  }, [dispatch])

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
      <h1>Estacionamento</h1>
      <input
        type="text"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
        placeholder="Enter vehicle ID"
      />
      <button onClick={handleReserve}>Reservar vaga</button>
      {slots.map((slot, index) => (
        <div key={index}>
          <button onClick={() => handleFree(index)} disabled={!slot}>
            {slot 
              ? `Free Slot ${index} (Vehicle: ${openBookings.find((r) => r.slotIndex === index)?.vehicleId})` 
              : `Slot ${index} (Free)`}
          </button>
        </div>
      ))}
      <h3>Histórico de reservas</h3>
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
          <h3>Últimos pedidos</h3>
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
