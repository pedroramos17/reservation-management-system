'use client';

import { initializeOrdersAsync, selectAllOrders } from "./orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect } from "react";

export default function OrderList() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeOrdersAsync());
    }, [dispatch]);

    const orders = useAppSelector((state) => selectAllOrders(state));
    
    return (
        <div>
            <h1>Lista de Pedidos</h1>

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
    )
}