import dbPromise, { PROPERTIES, Property } from "../db/idb";

export const addProperty = async (property: Property) => {
	const db = await dbPromise;
	await db.put(PROPERTIES, property);
};
