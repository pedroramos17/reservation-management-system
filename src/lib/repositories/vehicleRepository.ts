import dbPromise, { Vehicle, VEHICLES } from "../db/idb";
const getAll = async (): Promise<Vehicle[]> => {
	const db = await dbPromise;
	return db.getAll(VEHICLES);
};

const getById = async (id: string): Promise<Vehicle | undefined> => {
	const db = await dbPromise;
	return db.get(VEHICLES, id);
};

const add = async (vehicle: Vehicle): Promise<Vehicle> => {
	const db = await dbPromise;
	const id = await db.add(VEHICLES, vehicle);
	return { ...vehicle, id };
};

const update = async (
	vehicle: Partial<Vehicle> & { id: string }
): Promise<Vehicle> => {
	const db = await dbPromise;
	const existingVehicle = await getById(vehicle.id);
	if (!existingVehicle) {
		throw new Error(`Vehicle with id ${vehicle.id} not found`);
	}
	const updatedVehicle = { ...existingVehicle, ...vehicle };
	await db.put(VEHICLES, updatedVehicle);
	return updatedVehicle;
};

const remove = async (id: string): Promise<void> => {
	const db = await dbPromise;
	await db.delete(VEHICLES, id);
};

export { getAll, getById, add, update, remove };
