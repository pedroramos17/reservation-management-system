import { openDB, DBSchema } from "idb";

type RateByType =
	| "less-than-10-minutes"
	| "half-hour"
	| "hour"
	| "day"
	| "month";

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
	bills: {
		key: string;
		value: {
			id: string;
			bookingId: string;
			minutes: number;
			rateBy: RateByType;
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
		db.createObjectStore(SLOTS);
		const bookingStore = db.createObjectStore(BOOKINGS, {
			keyPath: "id",
		});
		bookingStore.createIndex("by-vehicle", "vehicleId");
		bookingStore.createIndex("by-slot", "slotIndex");
		bookingStore.createIndex("by-exit", "exitDate");
		const billStore = db.createObjectStore(BILLS, {
			keyPath: "id",
		});
		billStore.createIndex("by-booking", "bookingId");
	},
});

export default dbPromise;

export type Booking = ParkingLotDB[BookingType]["value"];
export type Customer = ParkingLotDB[CustomerType]["value"];
export type Bill = ParkingLotDB[BillType]["value"];

export const PARKING_LOTS = "parkingLots",
	SLOTS = "slots",
	BOOKINGS = "bookings",
	BILLS = "bills",
	CUSTOMERS = "customers",
	VEHICLES = "vehicles";

type BookingType = typeof BOOKINGS;
type BillType = typeof BILLS;
type CustomerType = typeof CUSTOMERS;
type VehicleType = typeof VEHICLES;
type SlotType = typeof SLOTS;
type ParkingLotType = typeof PARKING_LOTS;
