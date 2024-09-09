'use client';

import React, { useEffect, useState } from 'react';
import FlexSearch from 'flexsearch';
import { useBookingSlot } from './useBookingSlot';
import { initializeSlotsAsync } from './bookingSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Vehicle } from '@/lib/db/idb';
import { getVehiclesAsync, selectAllVehicles } from '../vehicles/vehiclesSlice';
import { Autocomplete, Button, Stack } from '@mui/material';
import Search from '@/lib/common/components/Search';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

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

interface BookingPageProps {
  readonly query: string;
}

export default function BookingPage(props: BookingPageProps) {
  const dispatch = useAppDispatch();
  const { slots, openBookings, bookings, orders } =
  useAppSelector((state) => state.bookings);
  const vehicles = useAppSelector((state) => selectAllVehicles(state));
  const { reserveSlot, freeSlot, chargingSelector, createOrder, howLongItTookForTheVehicleToLeaveInMinutes } = useBookingSlot();
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { query } = props;
  
  useEffect(() => {
    dispatch(getVehiclesAsync())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeSlotsAsync(10));
  }, [dispatch]);

  const handleReserve = async () => {
    if (vehicleId) {
      await reserveSlot(vehicleId);
      console.log(`Slot was reserved for vehicle ${vehicleId}`);
      setVehicleId(null);
    }
    setError('No vehicle selected');
    console.log(`No vehicle selected`);
  }
  const handleFree = (index: number) => {
    try {
      const slotReleased = freeSlot(index);
      if (!slotReleased) {
        console.log(`Slot ${index} was not reserved`);
        return;
      }
      const minutesSpent = howLongItTookForTheVehicleToLeaveInMinutes(
        slotReleased.entryDate, slotReleased.exitDate
      )
      const chargeBy =  "hour";
      const price = chargingSelector(minutesSpent, chargeBy, 0.25);

    createOrder({
      bookingId: slotReleased.id,
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
      <h1>Reservas</h1>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'start', gap: '24px' }}>
        <p>Total de vagas disponíveis: {slots.length}</p>
        <p>Total de vagas livres: {slots.filter((slot) => !slot).length}</p>
      </div>
      <Stack spacing={2} sx={{ width: '90%' }}>
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={vehicles.map((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.color} ${vehicle.variant} ${vehicle.year ?? ''} ${vehicle.licensePlate}`)}
          filterOptions={(options, { inputValue }) => {
            const vehiclesResponse = fetchFilteredVehicles(inputValue, vehicles);

            let searchedVehiclesIds: any = [];
            vehiclesResponse.forEach((response) => {
              searchedVehiclesIds = response['result'];
            })
            const filteredOptions = vehicles.filter((vehicle) => searchedVehiclesIds.includes(vehicle.id))
            return inputValue ? filteredOptions.map((option) => `${option.brand} ${option.model} ${option.color} ${option.variant} ${option.year ?? ''} ${option.licensePlate}`) : options;
          }}
          renderInput={(params) => <Search {...params} variant="standard" placeholder='Pesquise por marca, modelo, cor, placa...' />}
          value={query}
          onChange={(event, value) => setVehicleId(value)}
          renderOption={(props, option, { inputValue }) => {
            const matches = match(option, inputValue, { insideWords: true });
            const parts = parse(option, matches);
    
            return (
              <li {...props}>
                <div>
                  {parts.map((part: any, index: any) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
          />
      </Stack>
      <div style={{ display: 'flex', justifyContent: 'start' }}>
        <Button sx={{ width: 150, marginY: 1, marginRight: 2 }} variant='contained' disabled={!vehicleId} onClick={handleReserve}>Reservar vaga</Button>
      </div>
      {slots.map((slot, index) => slot && (
        <div key={index} style={{ display: 'flex', justifyContent: 'start', gap: '8px' }}>
          <Button sx={{ width: 150 }} onClick={() => handleFree(index)} disabled={!slot}>
            Liberar vaga {index}
          </Button>
          <p>Veículo: {openBookings.find((r) => r.slotIndex === index)?.vehicleId}</p>
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
