import { GatehouseData } from "@/lib/interfaces/gateway.interface";
import { Driver, Gateway, Vehicle } from "@/lib/utils/db";

export type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
	? K extends string
		? Pick<T, K & keyof T> & Partial<T>
		: never
	: never;

interface GatewayProps extends GatehouseData {
	driverId: string;
}

function mergeGatewaysWithDrivers(gateways: Gateway[], drivers: Driver[]) {
	const driversWithGateway = drivers.filter((driver) => {
		return gateways.some((gateway) => {
			return gateway.driverId === driver.id;
		});
	});
	/**
	 * Merges gateways with drivers and returns an array of GatehouseData objects.
	 *
	 * @param {Gateway[]} gateways - An array of Gateway objects.
	 * @param {Driver[]} drivers - An array of Driver objects.
	 * @return {GatewayProps[]} An array of GatehouseData objects.
	 */
	const entriesByDrivers: GatewayProps[] = gateways
		.map((gateway: Gateway): GatewayProps | undefined => {
			const driver: Driver | undefined = driversWithGateway.find(
				(driver: Driver) => {
					return driver.id === gateway.driverId;
				}
			);
			if (driver) {
				const vehicle: Vehicle | undefined = driver.vehicles.find(
					(vehicle: Vehicle) => {
						return vehicle.id === gateway.vehicleId;
					}
				) ?? {
					id: "",
					brand: "",
					model: "",
					year: 0,
					color: "",
					plate: "",
					createdAt: "",
					updatedAt: "",
				};
				return {
					id: gateway.id,
					driverId: gateway.driverId,
					name: driver.name,
					car: `${vehicle.model} ${vehicle.brand} ${vehicle.color} ${vehicle.year}`,
					plate: vehicle.plate,
					date: (
						gateway.createdAt as unknown as Date
					).toLocaleDateString("pt-BR"),
					hour: (
						gateway.createdAt as unknown as Date
					).toLocaleTimeString("pt-BR"),
					type: gateway.parked ? "Entrada" : "Saída",
				};
			}
		})
		.filter((entry): entry is GatewayProps => entry !== undefined);
	const driversWithoutGateway = drivers
		.filter((driver) => {
			return !gateways.some((gateway) => {
				return gateway.driverId === driver.id;
			});
		})
		.map((driver) => {
			return {
				id: driver.id,
				driverId: driver.id,
				name: driver.name,
				car: `${driver.vehicles[0].brand} ${driver.vehicles[0].model} ${driver.vehicles[0].color} ${driver.vehicles[0].year}`,
				plate: driver.vehicles[0].plate,
				date: "Sem registro",
				hour: "Sem registro",
				type: "Sem Entrada/Saida",
			};
		});

	const gatewaysData = [...entriesByDrivers, ...driversWithoutGateway];

	return gatewaysData;
}

export default mergeGatewaysWithDrivers;
