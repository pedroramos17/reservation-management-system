import dbPromise, { Customer, CUSTOMERS } from "../db/idb";
const getCustomers = async (): Promise<Customer[]> => {
	const db = await dbPromise;
	return db.getAll(CUSTOMERS);
};

const getById = async (id: string): Promise<Customer | undefined> => {
	const db = await dbPromise;
	return db.get(CUSTOMERS, id);
};

const setCustomer = async (customer: Customer) => {
	const db = await dbPromise;
	await db.put(CUSTOMERS, customer);
};

const removeCustomer = async (id: string): Promise<void> => {
	const db = await dbPromise;
	await db.delete(CUSTOMERS, id);
};

const removeManyCustomers = async (ids: string[]): Promise<void> => {
	const db = await dbPromise;
	const tx = db.transaction(CUSTOMERS, "readwrite");
	await Promise.all(ids.map((id) => tx.store.delete(id)));
	await tx.done;
};

export {
	getCustomers,
	setCustomer,
	getById,
	removeCustomer,
	removeManyCustomers,
};
