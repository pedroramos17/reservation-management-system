'use client';

import { Button, List, ListItem, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { initializeFromDB } from "./bookingSlice";
import { useEffect } from "react";

export default function BookingHistoryList() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(initializeFromDB())
      }, [dispatch])

    const { bookings } =
  useAppSelector((state) => state.bookings);

  type FormatDateType = string | number | Date | null;
  const formatDate = (date: FormatDateType) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

    return (
    <div>
        <h1>Histórico de reservas</h1>
        {bookings.map((booking) => booking && (
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
    );
}