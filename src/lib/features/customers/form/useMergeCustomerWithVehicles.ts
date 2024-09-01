import { Customer, Vehicle } from "@/lib/db/idb";

export interface CustomerWithVehicles extends Customer {
	vehicles: Vehicle[];
}
export default function useMergeCustomerWithVehicles(
	customer: Customer,
	vehicles: Vehicle[]
): CustomerWithVehicles {
	const allVehiclesOfCustomer: Vehicle[] = vehicles.filter(
		(vehicle) => vehicle.customerId === customer.id
	);

	return { ...customer, vehicles: allVehiclesOfCustomer };
}
