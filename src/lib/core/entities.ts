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

export interface ParkingLot extends Entity {
	totalSpaces: number;
}

export interface Vehicle extends Entity {
	customerId: string;
	model: string;
	year: number;
	color: string;
	licensePlate: string;
}

export interface Customer extends Entity {
	name: string;
	email: string;
	phone: number;
	taxpayerRegistration: number;
	vehicles: Vehicle[];
}

export interface Reserve extends Entity {
	customerId: string;
	vehicleId: string;
	slotId: string;
	startDate: string;
	endDate: string;
}

export interface Order extends Entity {}
