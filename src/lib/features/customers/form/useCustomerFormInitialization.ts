import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomerFormValues } from "./types";
import { CustomerWithVehicles } from "./useMergeCustomerWithVehicles";

function parseNumberOrNullToString(value: number | null) {
	return value ? String(value) : "";
}
export const useCustomerFormInitialization = (
	customerWithVehicles: CustomerWithVehicles
) => {
	const [formData, setFormData] = useState<CustomerFormValues>({
		name: "",
		email: "",
		taxpayerRegistration: "",
		phone: "",
		vehicles: [
			{
				id: "",
				brand: "",
				model: "",
				year: "",
				color: "",
				variant: "",
				licensePlate: "",
			},
		],
	});
	const dataParsed = useMemo(() => {
		return {
			name: customerWithVehicles.name,
			email: customerWithVehicles.email,
			taxpayerRegistration: parseNumberOrNullToString(
				customerWithVehicles.taxpayerRegistration
			),
			phone: parseNumberOrNullToString(customerWithVehicles.phone),
			vehicles: customerWithVehicles.vehicles.map((vehicle) => ({
				id: vehicle.id,
				brand: vehicle.brand,
				model: vehicle.model,
				year: parseNumberOrNullToString(vehicle.year),
				color: vehicle.color,
				variant: vehicle.variant,
				licensePlate: vehicle.licensePlate,
			})),
		};
	}, [customerWithVehicles]);

	useEffect(() => {
		setFormData(dataParsed);
	}, []);

	return formData;
};
