import dbPromise, { Reservation, Stores } from "../db/idb";
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

const getOpenReservations = async () => {
	const db = await dbPromise;
	const allReservations = await db.getAll("reservations");

	const allOpenReservations = allReservations.filter(
		(r) => r.exitDate === null
	);
	return allOpenReservations;
};

const getReservations = async () => {
	const db = await dbPromise;
	return db.getAll("reservations");
};

const addReservation = async (reservation: Reservation) => {
	const db = await dbPromise;
	await db.add("reservations", reservation);
};

const updateReservation = async (reservation: Reservation) => {
	const db = await dbPromise;
	await db.put("reservations", reservation);
};

export {
	getSlots,
	setSlots,
	getOpenReservations,
	getReservations,
	addReservation,
	updateReservation,
};
