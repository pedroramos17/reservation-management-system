'use client'

import { ParSlotMap } from "@/lib/core/ParSlotMap";
import { useEffect, useRef, useState } from "react";

interface Reserve {
    slotIndex: number;
    vehicleId: string;
}

export default function Page() {
        const [reserves, setReserves] = useState<Reserve[]>([])
        const parSlotMapRef = useRef<ParSlotMap | null>(null);
        
        const [slotsArray, setSlotsArray] = useState<boolean[]>([])
        
        useEffect(() => {
            parSlotMapRef.current = new ParSlotMap(10);
            setSlotsArray(parSlotMapRef.current!.getSlots())
        }, []); // Only run once on mount

        const handleReserve = (carId: string) => {
            if (parSlotMapRef.current) {
                const reservedSlot = parSlotMapRef.current.reserveSlot()
                reservedSlot !== null && setReserves(prevReserves => [...prevReserves, { slotIndex: reservedSlot, vehicleId: carId}])
            }
        };
      
        const handleFree = (slotIndex: number) => {
            if (parSlotMapRef.current) {
                const freeSlot = parSlotMapRef.current.freeSlot(slotIndex)
                freeSlot !== null && setReserves(reserves.filter(prevReserves => prevReserves.slotIndex !== slotIndex))
            }
        };

        const hasReserve = (vehicleId: string) => {
            return reserves.some((r) => r.vehicleId === vehicleId)
        }

        const getSlotIndexByVehicleId = (vehicleId: string) => {
            const reserve = reserves.filter((r) => r.vehicleId === vehicleId)
            return reserve[0].slotIndex
        }
        console.log(slotsArray)
        console.log(reserves)
    return (
        <div>
            <h1>Estacionamento</h1>
            <p>Quantidade de vagas livres: {slotsArray.length - reserves.length}</p>
      {vehicles.length > 0 ? (
        <ul>
            {vehicles.map((vehicle, index) => (
                <li key={index}>
                Carro {index} - {vehicle.model} - Status: {hasReserve(vehicle.id) ? "Estacionado" : "Saiu"}{' '}
                {!hasReserve(vehicle.id) && (
                    <button onClick={() => handleReserve(vehicle.id)}>Reservar</button>
                )}
                {hasReserve(vehicle.id) && (
                    <button onClick={() => handleFree(getSlotIndexByVehicleId(vehicle.id))}>Abrir vaga</button>
                )}
                </li>
            ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
        </div>
    )
}

const vehicles = [
    {
        id: "primary",
        model: "palio",
        licensePlate: "39j3jf",
        color: "red",
    },
    {
        id: "2",
        model: "corsa",
        licensePlate: "iorij4",
        color: "green",
    },
    {
        id: "3",
        model: "uno",
        licensePlate: "n4ojt",
        color: "black",
    },
    {
        id: "4",
        model: "brasilia",
        licensePlate: "4io3o4",
        color: "yellow",
    },
    {
        id: "5",
        model: "civic",
        licensePlate: "j44jnf",
        color: "gray",
    },
]