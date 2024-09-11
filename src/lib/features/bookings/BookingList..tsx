'use client';

import { useEffect, useMemo, useState } from "react";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { deleteBookingAsync, initializeFromDB } from "./bookingSlice";
import Anchor from "@/lib/common/components/Anchor";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Booking } from "@/lib/db/idb";

export default function BookingList() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(initializeFromDB())
      }, [dispatch])

    const {bookings, slots, openBookings} =
  useAppSelector((state) => state.bookings);
  const bookingValues = Object.values(bookings.entities);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  type FormatDateType = string | number | Date | null;
  const formatDate = (date: FormatDateType) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
  }
  const fromDateTimestamp: number = fromDate ? dayjs(fromDate).toDate().getTime() : 0;
  const toDateTimestamp: number = toDate ? dayjs(toDate).toDate().getTime() : new Date().getTime();
  const OneDaYInMilliseconds = 86400000;
  const filteredItems: Booking[] = useMemo(() => bookingValues.filter((booking) => booking.entryDate > fromDateTimestamp && booking.entryDate < toDateTimestamp + OneDaYInMilliseconds), [bookingValues, fromDateTimestamp, toDateTimestamp]);
  const handleDelete = async ({bookingId, vehicleId}: {bookingId: string, vehicleId: string}) => {
    if (openBookings) {
      const newOpenBookings = [...openBookings];
      console.info('newOpenBookings', newOpenBookings);
      const openBookingsByVehicleId = newOpenBookings.filter(
        (booking) => booking.vehicleId === vehicleId);
        console.log('vehicleOpenBookings', openBookingsByVehicleId);
        const openBookingsSlotIndex = openBookingsByVehicleId.map((booking) => booking.slotIndex);
        console.log('openBookingsSlotIndex', openBookingsSlotIndex);
        if (slots) {
          const newSlots = [...slots];
          if (openBookingsSlotIndex) {
            openBookingsSlotIndex.forEach((index) => {
              newSlots[index] = false;
            });
          }
    
          const newOpenBookings = openBookings.filter(
            (booking) => booking.vehicleId !== vehicleId
          );
          try {
            await dispatch(deleteBookingAsync({id: bookingId, newSlots, newOpenBookings})).unwrap();
          } catch (error) {
            console.error('handleDelete: error', error);
          };
        };
    }
    }
    return (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Anchor href="/estacionamento">
            <ArrowBack sx={{ fontSize: 36, color: '#000' }} />
            </Anchor>
            <h1>Histórico de reservas</h1>
        </div>
        <div style={{ display: 'grid', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="A partir da data"
                value={fromDate}
                onChange={(fromDate) => setFromDate(fromDate)}
              />
              <DatePicker
                label="Até a data"
                value={toDate}
                onChange={(toDate) => setToDate(toDate)}
              />
            </LocalizationProvider>
            <Button variant="outlined" onClick={handleReset}>Limpar</Button>
          </div>
          {filteredItems.map((booking) => booking && (
            <List key={booking.id} style={{ display: 'flex', justifyContent: 'start', gap: '8px', height: '56px' }}>
              <ListItem>
                    <ListItemText
                      primary={`Vehicle: ${booking.vehicleId}, 
                                Slot: ${booking.slotIndex}, 
                                Entry: ${formatDate(booking.entryDate)}, 
                                Exit: ${formatDate(booking.exitDate)},`}
                      secondary={'Nome do motorista'}
                    />
              </ListItem>
              <Button variant='outlined' color='error' sx={{ width: 150 }} onClick={() => handleDelete({bookingId: booking.id, vehicleId: booking.vehicleId})}	>
                Excluir
              </Button>
            </List>
          ))}
      </div>
    </div>
    );
}