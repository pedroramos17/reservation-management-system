import dbPromise, { Customer, CUSTOMERS } from "../db/idb";
const getAll = async (): Promise<Customer[]> => {
	const db = await dbPromise;
	return db.getAll(CUSTOMERS);
};

const getById = async (id: string): Promise<Customer | undefined> => {
	const db = await dbPromise;
	return db.get(CUSTOMERS, id);
};

const add = async (customer: Customer): Promise<Customer> => {
	const db = await dbPromise;
	const id = await db.add(CUSTOMERS, customer);
	return { ...customer, id };
};

const update = async (
	customer: Partial<Customer> & { id: string }
): Promise<Customer> => {
	const db = await dbPromise;
	const existingCustomer = await getById(customer.id);
	if (!existingCustomer) {
		throw new Error(`Customer with id ${customer.id} not found`);
	}
	const updatedCustomer = { ...existingCustomer, ...customer };
	await db.put(CUSTOMERS, updatedCustomer);
	return updatedCustomer;
};

const remove = async (id: string): Promise<void> => {
	const db = await dbPromise;
	await db.delete(CUSTOMERS, id);
};

export { getAll, getById, add, update, remove };
