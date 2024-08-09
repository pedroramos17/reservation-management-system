interface Entity {
	id: string;
	updatedAt: string;
	createdAt: string;
}

export interface User extends Entity {
	name: string;
	email: string;
	address: string;
	operatingHour: string;
}

interface Slot {
	[key: number]: boolean;
	vehicleId: string | null;
}
export interface ParkingLot extends Entity {
	totalSpaces: number;
	slots: Slot[];
}

export interface Vehicle extends Entity {
	customerId: string;
	brand: string;
	model: string;
	year: number;
	color: string;
	licensePlate: string;
}

export interface Customer extends Entity {
	name: string;
	email: string;
	taxpayerRegistration: number;
	phone: number;
	address: string;
	vehicles: Vehicle[];
}

export interface Reserve extends Entity {
	customerId: string;
	vehicleId: string;
	slotId: string;
	startDate: string;
	endDate: string;
	status: string; // pending, open, expired, canceled, finished
}

export interface Order extends Entity {}

export enum Stores {
	ParkingLots = "parkingLots",
	Slots = "slots",
	Customers = "customers",
	Vehicles = "vehicles",
	Reserves = "reserves",
}
