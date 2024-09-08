import { useCallback, useEffect } from "react";
import { getCustomersAsync, setCustomerAsync } from "./customersSlice";
import {
	deleteVehiclesAsync,
	getVehiclesAsync,
	setVehiclesAsync,
} from "../vehicles/vehiclesSlice";
import { useAppDispatch } from "@/lib/store";
import { Customer, Vehicle } from "@/lib/db/idb";
import { ulid } from "ulidx";
import { CustomerFormValues } from "./CustomerForm";
import { getVehiclesByCustomerId } from "@/lib/repositories/vehicleRepository";

function parseStringToNumberOrNull(value: string | undefined) {
	return value ? parseInt(value) : null;
}
export function useCustomerForm() {
	const dispatch = useAppDispatch();

	const addCustomer = useCallback(
		(values: CustomerFormValues) => {
			const { name, email, taxpayerRegistration, phone, vehicles } =
				values;
			const customerId = ulid();
			const newCustomer = {
				id: customerId,
				name,
				email,
				taxpayerRegistration:
					parseStringToNumberOrNull(taxpayerRegistration),
				phone: parseStringToNumberOrNull(phone),
				updatedAt: null,
			} as Customer;
			if (vehicles.length > 0) {
				let vehiclesArray: Vehicle[] = [];
				for (const vehicle of vehicles) {
					const vehicleId = ulid();
					const {
						id,
						brand,
						model,
						year,
						color,
						variant,
						licensePlate,
					} = vehicle;
					const newVehicle = {
						id: vehicleId,
						brand,
						model,
						year: parseStringToNumberOrNull(year),
						color,
						variant,
						licensePlate,
						customerId: newCustomer.id,
						updatedAt: null,
					} as Vehicle;
					vehiclesArray.push(newVehicle);
				}
				Promise.resolve(dispatch(setVehiclesAsync(vehiclesArray)));
			}
			Promise.resolve(dispatch(setCustomerAsync(newCustomer)));
		},
		[dispatch]
	);
	const updateCustomer = useCallback(
		async (values: CustomerFormValues, customerId: string) => {
			const { name, email, taxpayerRegistration, phone, vehicles } =
				values;
			const updatedCustomer: Customer = {
				id: customerId,
				name,
				email,
				taxpayerRegistration:
					parseStringToNumberOrNull(taxpayerRegistration),
				phone: parseStringToNumberOrNull(phone),
				updatedAt: new Date().getTime(),
			};

			let updatedVehicles: Vehicle[] = [];
			for (const vehicle of vehicles) {
				const vehicleData = {
					id: vehicle?.id ?? ulid(),
					brand: vehicle?.brand ?? "",
					model: vehicle?.model ?? "",
					year: parseStringToNumberOrNull(vehicle?.year),
					color: vehicle?.color ?? "",
					variant: vehicle?.variant ?? "",
					licensePlate: vehicle?.licensePlate ?? "",
					customerId: updatedCustomer.id,
					updatedAt:
						vehicle?.id === undefined ? null : new Date().getTime(),
				} as Vehicle;
				updatedVehicles.push(vehicleData);
			}
			console.log("updatedVehicles: ", updatedVehicles);
			const customerVehicles = await getVehiclesByCustomerId(customerId);
			console.log("customerVehicles: ", customerVehicles);
			const vehicleIdsDeleted = customerVehicles
				.map((vehicle) => vehicle.id)
				.filter((id) => {
					return !updatedVehicles.some(
						(vehicle) => vehicle.id === id
					);
				});
			console.log("customerVehicles: ", vehicleIdsDeleted);

			Promise.all([
				dispatch(deleteVehiclesAsync(vehicleIdsDeleted)),
				dispatch(setVehiclesAsync(updatedVehicles)),
			]);
			Promise.resolve(dispatch(setCustomerAsync(updatedCustomer)));
		},
		[dispatch]
	);
	return {
		addCustomer,
		updateCustomer,
	};
}
