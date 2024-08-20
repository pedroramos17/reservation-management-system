import dbPromise, { Booking, Stores } from "../db/idb";
const SLOTS = Stores.Slots;
const getSlots = async () => {
	const db = await dbPromise;
	return db.getAll("slots");
};

const setSlots = async (slots: boolean[]) => {
	const db = await dbPromise;
	const tx = db.transaction("slots", "readwrite");
	await Promise.all(
		slots.map((isReserved, index) => tx.store.put(isReserved, index))
	);
	await tx.done;
};

const getOpenBookings = async () => {
	const db = await dbPromise;
	const allBookings = await db.getAll("bookings");

	const allOpenBookings = allBookings.filter((r) => r.exitDate === null);
	return allOpenBookings;
};

const getBookings = async () => {
	const db = await dbPromise;
	return db.getAll("bookings");
};

const addBooking = async (booking: Booking) => {
	const db = await dbPromise;
	await db.add("bookings", booking);
};

const updateBooking = async (booking: Booking) => {
	const db = await dbPromise;
	await db.put("bookings", booking);
};

export {
	getSlots,
	setSlots,
	getOpenBookings,
	getBookings,
	addBooking,
	updateBooking,
};
