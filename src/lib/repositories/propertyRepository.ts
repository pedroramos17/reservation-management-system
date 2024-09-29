import dbPromise, { PROPERTIES, Property } from "../db/idb";

export const getProperties = async () => {
	const db = await dbPromise;
	return await db.getAll(PROPERTIES);
};
export const addProperty = async (property: Property) => {
	const db = await dbPromise;
	await db.put(PROPERTIES, property);
};
