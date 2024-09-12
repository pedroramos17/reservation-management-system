import dbPromise, { Order, ORDERS } from "../db/idb";

const getOrders = async () => {
	const db = await dbPromise;
	return db.getAll(ORDERS);
};
const addOrder = async (order: Order) => {
	const db = await dbPromise;
	await db.add(ORDERS, order);
};

const deleteOrder = async (id: string): Promise<void> => {
	const db = await dbPromise;
	await db.delete(ORDERS, id);
};

export { getOrders, addOrder, deleteOrder };
