import { useCallback, useEffect } from "react";
import { getCustomersAsync, setCustomerAsync } from "./customersSlice";
import { getVehiclesAsync, setVehiclesAsync } from "../vehicles/vehiclesSlice";
import { useAppDispatch } from "@/lib/store";
import { Customer, Vehicle } from "@/lib/db/idb";
import { ulid } from "ulidx";
import { CustomerFormValues } from "./CustomerForm";

function parseStringToNumberOrNull(value: string | undefined) {
	/**
	 * Tries to parse a given string as a number, returning null if it
	 * cannot be parsed.
	 *
	 * @param {string|undefined} value The value to parse.
	 * @returns {number|null} The parsed number, or null.
	 */
	return value ? parseInt(value) : null;
}
export function useCustomerForm() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getVehiclesAsync());
		dispatch(getCustomersAsync());
	}, [dispatch]);

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
				dispatch(setCustomerAsync(newCustomer));
				dispatch(setVehiclesAsync(vehiclesArray));
			}
		},
		[dispatch]
	);

	const updateCustomer = useCallback(
		(values: CustomerFormValues, customerId: string) => {
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
			if (vehicles.length > 0) {
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
							vehicle?.id === undefined
								? null
								: new Date().getTime(),
					} as Vehicle;
					updatedVehicles.push(vehicleData);
				}
				dispatch(setVehiclesAsync(updatedVehicles));
			}
			dispatch(setCustomerAsync(updatedCustomer));
		},
		[dispatch]
	);
	return {
		addCustomer,
		updateCustomer,
	};
}
