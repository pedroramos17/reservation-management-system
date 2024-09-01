import { openDB, DBSchema } from "idb";

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
			entryDate: number;
			exitDate: number | null;
		};
		indexes: { "by-vehicle": string; "by-slot": number; "by-exit": string };
	};
	orders: {
		key: string;
		value: {
			id: string;
			bookingId: string;
			minutes: number;
			chargeBy: ChargeByType;
			price: number;
		};
		indexes: { "by-booking": string };
	};
	customers: {
		key: string;
		value: {
			id: string;
			name: string;
			email: string;
			phone: number;
			taxpayerRegistration: number;
			updatedAt: number | null;
		};
		indexes: { "by-email": string };
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
			updatedAt: number | null;
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
			updatedAt: number | null;
		};
	};
}

const dbPromise = openDB<ParkingLotDB>("parSlotMapDB", 1, {
	upgrade(db) {
		db.createObjectStore(SLOTS);
		const bookingStore = db.createObjectStore(BOOKINGS, {
			keyPath: "id",
		});
		bookingStore.createIndex("by-vehicle", "vehicleId");
		bookingStore.createIndex("by-slot", "slotIndex");
		bookingStore.createIndex("by-exit", "exitDate");
		const customerStore = db.createObjectStore(CUSTOMERS, {
			keyPath: "id",
		});
		customerStore.createIndex("by-email", "email");
		const vehicleStore = db.createObjectStore(VEHICLES, {
			keyPath: "id",
		});
		vehicleStore.createIndex("by-driver", "driverId");
		const orderStore = db.createObjectStore(ORDERS, {
			keyPath: "id",
		});
		orderStore.createIndex("by-booking", "bookingId");
	},
});

export default dbPromise;

export type Booking = ParkingLotDB["bookings"]["value"];
export type Customer = ParkingLotDB["customers"]["value"];
export type Order = ParkingLotDB["orders"]["value"];
export type Vehicle = ParkingLotDB["vehicles"]["value"];

export type ChargeByType =
	| "none"
	| "less-than-10-minutes"
	| "half-hour"
	| "hour"
	| "day"
	| "month";

export const PARKING_LOTS = "parkingLots",
	SLOTS = "slots",
	BOOKINGS = "bookings",
	ORDERS = "orders",
	CUSTOMERS = "customers",
	VEHICLES = "vehicles";
