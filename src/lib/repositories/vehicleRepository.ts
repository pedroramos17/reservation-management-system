import dbPromise, { Vehicle, VEHICLES } from "../db/idb";

const getVehicles = async (): Promise<Vehicle[]> => {
	const db = await dbPromise;
	return db.getAll(VEHICLES);
};

const setVehicles = async (vehicles: Vehicle[]) => {
	const db = await dbPromise;
	const tx = db.transaction(VEHICLES, "readwrite");
	await Promise.all(vehicles.map((vehicle) => tx.store.put(vehicle)));
	await tx.done;
};

const removeVehicles = async (ids: string[]): Promise<void> => {
	const db = await dbPromise;
	const tx = db.transaction(VEHICLES, "readwrite");
	await Promise.all(ids.map((id) => tx.store.delete(id)));
	await tx.done;
};

export { getVehicles, setVehicles, removeVehicles };
