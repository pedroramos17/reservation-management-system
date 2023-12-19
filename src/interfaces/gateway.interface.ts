export interface GatewayData {
	id: string;
	name: string;
	rg: number;
	phone: number;
	plate: string;
	parked: boolean;
}
export interface GatehouseData {
	id: string;
	name: string;
	car: string;
	plate: string;
	date: string;
	hour: string;
	type: string;
}

export interface GatewayApiResponse {
	id: string;
	date: string;
	parked: boolean;
	driver_id: string;
}
