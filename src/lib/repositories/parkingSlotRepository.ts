import dbPromise, { Booking, Bill, SLOTS, BOOKINGS, BILLS } from "../db/idb";
const getSlots = async () => {
	const db = await dbPromise;
	return db.getAll(SLOTS);
};

const setSlots = async (slots: boolean[]) => {
	const db = await dbPromise;
	const tx = db.transaction(SLOTS, "readwrite");
	await Promise.all(
		slots.map((isReserved, index) => tx.store.put(isReserved, index))
	);
	await tx.done;
};

const getOpenBookings = async () => {
	const db = await dbPromise;
	const allBookings = await db.getAll(BOOKINGS);

	const allOpenBookings = allBookings.filter((r) => r.exitDate === null);
	return allOpenBookings;
};

const getBookings = async () => {
	const db = await dbPromise;
	return db.getAll(BOOKINGS);
};

const addBooking = async (booking: Booking) => {
	const db = await dbPromise;
	await db.add(BOOKINGS, booking);
};

const updateBooking = async (booking: Booking) => {
	const db = await dbPromise;
	await db.put(BOOKINGS, booking);
};

const getBills = async () => {
	const db = await dbPromise;
	return db.getAll(BILLS);
};

const addBill = async (bill: Bill) => {
	const db = await dbPromise;
	await db.add(BILLS, bill);
};

export {
	getSlots,
	setSlots,
	getOpenBookings,
	getBookings,
	addBooking,
	updateBooking,
	getBills,
	addBill,
};
