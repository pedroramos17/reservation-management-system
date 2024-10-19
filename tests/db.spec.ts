// By requiring fake-indexeddb/auto, code in that module automatically runs,
// loading every global function and variable in IndexedDB, such as the
// indexedDB global object itself, the IDBCursor constructor, etc. In automated
// tests, we need to load this because indexedDB is not one of Node's global
// objects like it is in a browser's `window`.
import "client-only";
import "fake-indexeddb/auto";
import {
	ParkingLotDB,
	PROPERTIES,
	ROOMS,
	SERVICES,
	SELLABLE_PRODUCTS,
	SLOTS,
	BOOKINGS,
	CUSTOMERS,
	VEHICLES,
	ORDERS,
} from "@/lib/db/idb";
import { IDBPDatabase, openDB } from "idb";

let dbPromise: IDBPDatabase<ParkingLotDB>;
beforeAll(async () => {
	dbPromise = await openDB<ParkingLotDB>("parSlotMapDB", 1, {
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
});
test("we can store and retrieve customers", function (done) {});
