'use client';

import { getOrdersAsync, selectAllOrders } from "./orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect } from "react";
import OrderCard from "./OrderCard";
import { getVehiclesAsync } from "../vehicles/vehiclesSlice";
import { getCustomersAsync } from "../customers/customersSlice";
import { getBookingsAsync } from "../bookings/bookingSlice";

export default function OrderList() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCustomersAsync());
        dispatch(getVehiclesAsync());
        dispatch(getBookingsAsync());
        dispatch(getOrdersAsync());
    }, [dispatch]);

    const orders = useAppSelector((state) => selectAllOrders(state));
    
    return (
        <div>
            <h1>Lista de Pedidos</h1>

            {orders && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                        {orders.map((order) => {   
                            return  (
                                <div key={order.bookingId}>
                                    <OrderCard order={order} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}