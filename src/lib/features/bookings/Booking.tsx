'use client';

import React, { useEffect, useState } from 'react';
import FlexSearch from 'flexsearch';
import { useBookingSlot } from './useBookingSlot';
import { initializeSlotsAsync } from './bookingSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Vehicle } from '@/lib/db/idb';
import { getVehiclesAsync, selectAllVehicles } from '../vehicles/vehiclesSlice';
import { Autocomplete, Button, List, ListItem, ListItemText, Stack } from '@mui/material';
import Search from '@/lib/common/components/Search';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import HistoryIcon from '@mui/icons-material/History';
import Anchor from '@/lib/common/components/Anchor';

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
  const { slots, openBookings, orders } =
  useAppSelector((state) => state.bookings);
  const vehicles = useAppSelector((state) => selectAllVehicles(state));
  const { reserveSlot, freeSlot, chargingSelector, createOrder, howLongItTookForTheVehicleToLeaveInMinutes } = useBookingSlot();
  const [vehicleId, setVehicleId] = useState<string | null>(null);
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

  const handleSelectVehicleOption = (event: any, value: string | null) => {
    const vehicleLicensePlate = value?.split(' ').at(-1) || null;
    setVehicleId(vehicleLicensePlate);
    console.log(vehicleId);
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
          value={query}
          onChange={handleSelectVehicleOption}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0', height: '60px' }}>
        <Button sx={{ width: 150, marginY: 1, marginRight: 2 }} variant='contained' disabled={!vehicleId} onClick={handleReserve}>Reservar</Button>
        <Button ><Anchor href={'/estacionamento/historico'} ><span style={{width: '100%', display: 'flex', alignItems: 'center', gap: '8px'}}><HistoryIcon /> histórico de reservas</span></Anchor></Button>
      </div>
      {slots.map((slot, index) => slot && (
      <List key={index}  style={{ display: 'flex', justifyContent: 'start', gap: '8px' }}>
        <ListItem>
              <ListItemText
                primary={`Veículo: ${openBookings.find((r) => r.slotIndex === index)?.vehicleId}`}
                secondary={'Nome do motorista'}
              />
            </ListItem>
          <Button sx={{ width: 150 }} onClick={() => handleFree(index)} disabled={!slot}>
            Liberar reserva {index}
          </Button>
      </List>
      ))}
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
