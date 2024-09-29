import { openDB, DBSchema } from "idb";
import { currencyCodeList } from "../features/utils/currencyCodeList";

interface ParkingLotDB extends DBSchema {
	properties: {
		key: string;
		value: {
			propertyId: string;
			propertyName: string;
			propertyOrganization?: string;
			propertyCategory: number; // Código da categoria da propriedade, ex: escola, hotel, hospital, etc.
			propertyInfo: {
				coordinates: number[];
				checkInFrom: string;
				checkOutTo: string;
				services: {
					key: string;
					value:
						| string
						| number
						| { key: string; value: string | number }[];
				}[];
			};
			contactInfo: {
				[key in ContactProfileType]: {
					contactProfileType: ContactProfileType | string;
					name: string;
					email: string[];
					phone: number[];
					address: {
						countryCode: string;
						addressLine: string;
						number?: number;
						addressLine2?: string;
						cityName: string;
						stateProvinceCode: string;
						postalCode: number;
						updatedAt: number | null;
					};
					updatedAt: number | null;
				};
			}[];
			updatedAt: number | null;
		};
	};
	rooms: {
		key: string;
		value: {
			roomId: string;
			description: string;
			policy: string; // regras da sala, ex: em construção.
			capacity: number; // capacidade da sala
			roomType: string; // laboratório de informática, química, nutrição ou sala de aula normal
			roomCategory: string; // sala de química, nutrição, ADM ou desenvolvimento de sistemas
			views: string; // visão da janela, ex: quadra, jardim, pátio, corredor, etc.
			amenities: string[]; // salas com ar-condicionado, projetor, lousa e etc.
		};
	};
	services: {
		key: string;
		value: {
			serviceId: string;
			serviceName: string;
			currencyCode: CurrencyCodeType;
			serviceType: string;
			description: string;
			serviceCode: string;
			servicePrice: number;
		};
	};
	sellableProducts: {
		key: string;
		value: {
			id: string;
			propertyId: string;
			productInfo: {
				name: string;
				productType: string;
				details: {
					key: string;
					value: string | number | { key: string; value: string };
				}[];
				amenities: {
					key: string;
					value: string | number;
				}[];
			};
			updatedAt: number | null;
		};
	};
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
			chargePer: ChargePer;
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
			phone: number | null;
			taxpayerRegistration: number | null;
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
			year: number | null;
			color: string;
			variant: string;
			licensePlate: string;
			customerId: string;
			updatedAt: number | null;
		};
		indexes: { "by-customer": string };
	};
	users: {
		key: string;
		value: {
			id: string;
			name: string;
			email: string;
			operatingHour: string;
			updatedAt: number | null;
		};
	};
}

const dbPromise = openDB<ParkingLotDB>("parSlotMapDB", 1, {
	upgrade(db) {
		db.createObjectStore(PROPERTIES, {
			keyPath: "propertyId",
		});
		db.createObjectStore(ROOMS);
		db.createObjectStore(SERVICES, {
			keyPath: "serviceId",
		});
		db.createObjectStore(SELLABLE_PRODUCTS);
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
		vehicleStore.createIndex("by-customer", "customerId");
		const orderStore = db.createObjectStore(ORDERS, {
			keyPath: "id",
		});
		orderStore.createIndex("by-booking", "bookingId");
	},
});

export default dbPromise;

export type Property = ParkingLotDB["properties"]["value"];
export type Booking = ParkingLotDB["bookings"]["value"];
export type Customer = ParkingLotDB["customers"]["value"];
export type Order = ParkingLotDB["orders"]["value"];
export type Vehicle = ParkingLotDB["vehicles"]["value"];

export type PropertyCategory =
	| "school"
	| "hotel"
	| "hospital"
	| "office"
	| "restaurant"
	| "other";
export type CurrencyCodeType = typeof currencyCodeList;

export type ChargePer = "hour" | "day" | "month" | "stay";

export type ContactProfileType = "physicalLocation" | "general" | "invoices";

export const AmenityType = {
	PARKING_LOT: {},
};

export const PROPERTIES = "properties",
	ROOMS = "rooms",
	SERVICES = "services",
	SELLABLE_PRODUCTS = "sellableProducts",
	SLOTS = "slots",
	BOOKINGS = "bookings",
	ORDERS = "orders",
	CUSTOMERS = "customers",
	VEHICLES = "vehicles";

export type CheckIOTimeType =
	| "00:00"
	| "00:30"
	| "01:00"
	| "01:30"
	| "02:00"
	| "02:30"
	| "03:00"
	| "03:30"
	| "04:00"
	| "04:30"
	| "05:00"
	| "05:30"
	| "06:00"
	| "06:30"
	| "07:00"
	| "07:30"
	| "08:00"
	| "08:30"
	| "09:00"
	| "09:30"
	| "10:00"
	| "10:30"
	| "11:00"
	| "11:30"
	| "12:00"
	| "12:30"
	| "13:00"
	| "13:30"
	| "14:00"
	| "14:30"
	| "15:00"
	| "15:30"
	| "16:00"
	| "16:30"
	| "17:00"
	| "17:30"
	| "18:00"
	| "18:30"
	| "19:00"
	| "19:30"
	| "20:00"
	| "20:30"
	| "21:00"
	| "21:30"
	| "22:00"
	| "22:30"
	| "23:00"
	| "23:30";
