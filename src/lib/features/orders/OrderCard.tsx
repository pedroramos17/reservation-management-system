import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Order } from '@/lib/db/idb';
import { selectBookingById } from '../bookings/bookingSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectCustomerById } from '../customers/customersSlice';
import { selectVehicleById } from '../vehicles/vehiclesSlice';
import { deleteOrderAsync } from './orderSlice';

interface CardProps {
    order: Order;
}

export default function OrderCard({order}: CardProps) {
    const dispatch = useAppDispatch();
    const booking = useAppSelector((state) => selectBookingById(state, order.id));
    const vehicle = useAppSelector((state) => selectVehicleById(state, booking?.vehicleId));
    const customer = useAppSelector((state) => selectCustomerById(state, vehicle?.customerId));

    const hours = Math.floor(order.minutes / 60),
    minutes = order.minutes % 60;

    const handleDeleteOrder = (orderId: string) => {
        console.log("delete order: ", order)
        dispatch(deleteOrderAsync(orderId))
    }
  return (
    <Box sx={{ minWidth: '148px' }}>
      <Card variant="outlined">
      <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                id: # {order.id}
            </Typography>
            <Typography variant="h5" component="div">
                {customer ? customer.name : 'Sem nome do cliente'}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
            <Typography variant="body2">
                Tempo passado: {hours}h {minutes}m, 
                Total: R${order.price.toFixed(2)}
            </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-around' }}>
              <Button size="small" variant='outlined'>Exportar PDF</Button>
              <Button size="small" color='error' variant="contained" onClick={() => handleDeleteOrder(order.id)}>Excluir</Button>
            </CardActions>
      </Card>
    </Box>
  );
}
