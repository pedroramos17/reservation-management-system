import { openDB, DBSchema, wrap } from "idb";

interface ParkingLotDB extends DBSchema {
	slots: {
		key: number;
		value: boolean;
	};
	bookings: {
		key: string;
		value: {
			id: string;
			vehicleId: string;
			slotIndex: number;
			entryDate: Date;
			exitDate: Date | null;
		};
		indexes: { "by-vehicle": string; "by-slot": number; "by-exit": string };
	};
	customers: {
		key: string;
		value: {
			id: string;
			name: string;
			email: string;
			phone: number;
			taxpayerRegistration: number;
		};
	};
	vehicles: {
		key: string;
		value: {
			id: string;
			brand: string;
			model: string;
			year: number;
			color: string;
			variant: string;
			licensePlate: string;
			driverId: string;
		};
		indexes: { "by-driver": string };
	};
	users: {
		key: string;
		value: {
			id: string;
			name: string;
			email: string;
			address: string;
			operatingHour: string;
		};
	};
}

const dbPromise = openDB<ParkingLotDB>("parSlotMapDB", 1, {
	upgrade(db) {
		db.createObjectStore("slots");
		const historyStore = db.createObjectStore("bookings", {
			keyPath: "id",
		});
		historyStore.createIndex("by-vehicle", "vehicleId");
		historyStore.createIndex("by-slot", "slotIndex");
		historyStore.createIndex("by-exit", "exitDate");
	},
});

export default dbPromise;

export type Booking = ParkingLotDB["bookings"]["value"];
export type Customer = ParkingLotDB["customers"]["value"];

export enum Stores {
	ParkingLots = "parkingLots",
	Slots = "slots",
	Customers = "customers",
	Vehicles = "vehicles",
	Reserves = "reserves",
}
