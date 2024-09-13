import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Customer, Order, Vehicle } from '@/lib/db/idb';
import { selectBookingById } from '../bookings/bookingSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { selectCustomerById } from '../customers/customersSlice';
import { selectVehicleById } from '../vehicles/vehiclesSlice';
import { deleteOrderAsync } from './orderSlice';

interface CardProps {
    order: Order;
    customer: Customer;
    vehicle: Vehicle;
    chargeBy: string;
}

function OrderCardContent({order, customer, vehicle, chargeBy}: CardProps) {
  const hours = Math.floor(order.minutes / 60),
    minutes = order.minutes % 60;

    return (
            <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                id #{order.id}
            </Typography>
            <Typography variant="h5" component="div">
                {customer ? customer.name : 'Sem nome do cliente'}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{vehicle && `${vehicle.brand} ${vehicle.model} ${vehicle.year ?? ''} ${vehicle.color} ${vehicle.variant} ${vehicle.licensePlate}`}</Typography>
            <Typography variant="body2">
              Plano escolhido: {chargeBy} <br />
                Tempo passado: {hours}h {minutes}m <br />
                Total: R${order.price.toFixed(2)}
            </Typography>
            </CardContent>
      );
}

export default function OrderCard({order}: {order: Order}) {
    const dispatch = useAppDispatch();

    const booking = useAppSelector((state) => selectBookingById(state, order.bookingId));
    const vehicle = useAppSelector((state) => selectVehicleById(state, booking.vehicleId));
    const customer = useAppSelector((state) => selectCustomerById(state, vehicle.customerId));

    
    const handleDeleteOrder = (orderId: string) => {
      console.log("delete order: ", order)
      dispatch(deleteOrderAsync(orderId))
    }

    const chargeBy = order.chargeBy === 'none' ? 'Sem plano' :
    order.chargeBy === 'less-than-10-minutes' ? 'Menos de 10 minutos' : 
    order.chargeBy === 'half-hour' ? 'meia-hora' :
    order.chargeBy === 'hour' ? 'hora' :
    order.chargeBy === 'day' ? 'diário' :
    order.chargeBy === 'month' ? 'mensal' : 'Sem plano';

    const styles = StyleSheet.create({
      page: {
        backgroundColor: '#FFFFFF',
      },
      section: {
        margin: 16,
        padding: 10,
        flexGrow: 1,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
      },
      title: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 2,
      },
      subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 2,
        color: 'gray',
      },
      strong: {
        fontWeight: 'bold',
      }
    });

    type OrderDocumentProps = {
      order: Order;
      customer: Customer;
      vehicle: Vehicle;
      chargeBy: string;
    }

    const OrderDocument = (
      { order, customer, vehicle, chargeBy }: OrderDocumentProps
    ) => {
      const date = new Date(parseInt(order.id)).toLocaleDateString('pt-BR', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
      return (
      <Document title={customer.name}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.row}>
            <View>
              <Text style={styles.title}>Ordem de pagamento</Text>
              <Text style={styles.subtitle}>{date}</Text>
            </View>
            </View>
            <View style={styles.row}> 
              <Text style={styles.strong}>Valor</Text>
              <Text>R${order.price.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Cliente</Text>
              <Text>{customer.name}</Text>
            </View>
            <View style={styles.row}>
              <Text>Plano escolhido</Text>
              <Text>{chargeBy}</Text>
            </View>
            <View>
              <Text style={{ marginBottom: 24, alignItems: 'center'}}>===================================================</Text>
              <View style={styles.row}>
                <Text>Tempo gasto</Text>
                <Text>{order.minutes}h {order.minutes}m</Text>
              </View>
              <View style={styles.row}>
                <Text>Descrição</Text>
                <Text>{vehicle.brand} {vehicle.model} {vehicle.year ?? ''} {vehicle.color} {vehicle.variant} {vehicle.licensePlate}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    )}

  return (
    <>
      <Box sx={{ minWidth: '148px', display: 'flex', justifyContent: 'center' }}>
      </Box>
      <Box sx={{ minWidth: '148px' }}>
        <Card variant="outlined">
          <OrderCardContent  order={order} customer={customer} vehicle={vehicle} chargeBy={chargeBy} />
          <CardActions sx={{ justifyContent: 'space-around' }}>
            <Button size="small" variant='outlined'>
              <PDFDownloadLink document={<OrderDocument order={order} customer={customer} vehicle={vehicle} chargeBy={chargeBy}/>} fileName={`${customer.name}-${order.id}.pdf`} style={{ textDecoration: 'none' }}>Exportar PDF</PDFDownloadLink>
            </Button>
            <Button size="small" color='error' variant="contained" onClick={() => handleDeleteOrder(order.id)}>Excluir</Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}
