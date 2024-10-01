'use client';

import React from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const BookingCell = styled(TableCell)(({ theme }) => ({
  padding: 0,
  height: '100%',
}));

const BookingContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  fontSize: '0.75rem',
  height: '100%',
}));

export default function Component() {
  const rooms = [
    { id: 1, type: "SNGJ", name: "Room 1" },
    { id: 2, type: "SNGJ", name: "Room 2" },
    { id: 3, type: "SNGJ", name: "Room 3" },
    { id: 4, type: "DBL", name: "Room 4" },
    { id: 5, type: "DBL", name: "Room 5" },
    { id: 6, type: "DBL", name: "Room 6" },
    { id: 7, type: "TWN", name: "Room 7" },
    { id: 8, type: "TWN", name: "Room 8" },
    { id: 9, type: "TWN", name: "Room 9" },
    { id: 10, type: "TWN", name: "Room 10" },
  ];

  const bookings = [
    { roomId: 1, guestName: "A. Gordon", startDate: "2018-08-12", endDate: "2018-08-18" },
    { roomId: 2, guestName: "M. Yia", startDate: "2018-08-18", endDate: "2018-08-21" },
    { roomId: 3, guestName: "Miller", startDate: "2018-08-12", endDate: "2018-08-14" },
    { roomId: 4, guestName: "O.Mawes", startDate: "2018-08-12", endDate: "2018-08-14" },
    { roomId: 4, guestName: "W.Polic", startDate: "2018-08-14", endDate: "2018-08-16" },
    { roomId: 4, guestName: "B. Rojen", startDate: "2018-08-18", endDate: "2018-08-25" },
  ];

  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto' }}>
      <CardContent>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField type="date" fullWidth label="Check-in" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField type="date" fullWidth label="Check-out" InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          NEW BOOKING
        </Button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="reservation calendar">
            <TableHead>
              <TableRow>
                <StyledTableCell>Room</StyledTableCell>
                {[...Array(14)].map((_, i) => (
                  <StyledTableCell key={i} align="center">
                    {new Date(2018, 7, 12 + i).getDate()}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell component="th" scope="row">
                    {room.type} {room.name}
                  </TableCell>
                  {[...Array(14)].map((_, i) => {
                    const date = new Date(2018, 7, 12 + i);
                    const booking = bookings.find(
                      (b) =>
                        b.roomId === room.id &&
                        new Date(b.startDate) <= date &&
                        new Date(b.endDate) > date
                    );
                    return (
                      <BookingCell key={i}>
                        {booking && (
                          <BookingContent
                            style={{
                              width: `${
                                (new Date(booking.endDate).getTime() -
                                  Math.max(date.getTime(), new Date(booking.startDate).getTime())) /
                                (24 * 60 * 60 * 1000) *
                                100
                              }%`,
                            }}
                          >
                            {booking.guestName}
                          </BookingContent>
                        )}
                      </BookingCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}