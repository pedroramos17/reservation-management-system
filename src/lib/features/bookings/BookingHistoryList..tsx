'use client';

import { Button, List, ListItem, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { initializeFromDB } from "./bookingSlice";
import { useEffect, useMemo, useState } from "react";
import Anchor from "@/lib/common/components/Anchor";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Booking } from "@/lib/db/idb";
export default function BookingHistoryList() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(initializeFromDB())
      }, [dispatch])

    const { bookings } =
  useAppSelector((state) => state.bookings);
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs('2022-04-17'));
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
  const filteredItems: Booking[] = useMemo(() => bookings.filter((booking) => booking.entryDate > fromDateTimestamp && booking.entryDate < toDateTimestamp + OneDaYInMilliseconds), [bookings, fromDateTimestamp, toDateTimestamp]);

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
              <Button variant='outlined' color='warning' sx={{ width: 150 }}>
                Editar
              </Button>
              <Button variant='outlined' color='error' sx={{ width: 150 }}>
                Excluir
              </Button>
            </List>
          ))}
      </div>
    </div>
    );
}