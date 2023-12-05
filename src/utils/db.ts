let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 2;

interface Vehicle {
	id: string;
	brand: string;
	model: string;
	year: number;
	color: string;
	plate: string;
}

export interface Driver {
	id: string;
	name: string;
	rg: string;
	phone: string;
	vehicles: Vehicle[];
}

export interface Gateway {
	id: string;
	date: string;
	parked: boolean;
	driver_id: string;
}

export enum Stores {
	Drivers = "drivers",
	Gateways = "gateways",
}
const DB_NAME = "barkin";
const initDB = (): Promise<boolean> => {
	return new Promise((resolve) => {
		// open the connection
		request = window.indexedDB.open(DB_NAME, version);
		request.onblocked = (e) => {
			console.log("request.onblocked", e);
			(e.target as any).result.close();
		};
		request.onupgradeneeded = (e) => {
			db = e?.target?.result;

			// if the data object store doesn't exist, create it
			if (!db.objectStoreNames.contains(Stores.Drivers)) {
				console.log("Creating drivers store");
				db.createObjectStore(Stores.Drivers, { keyPath: "id" });
			}
			if (!db.objectStoreNames.contains(Stores.Gateways)) {
				console.log("Creating gateways store");
				db.createObjectStore(Stores.Gateways, { keyPath: "id" });
			}
			// no need to resolve here
		};

		request.onsuccess = (e) => {
			db = e?.target?.result;
			version = db.version;
			console.log("request.onsuccess - initDB " + version);
			resolve(true);
		};

		request.onerror = (e) => {
			(e.target as any).result.close();
			resolve(false);
		};
	});
};
const addData = <T>(storeName: string, data: T): Promise<T | string | null> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - addData", data);
			db = e?.target?.result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			store.add(data);
			resolve(data);
		};

		request.onerror = (e) => {
			(e.target as any).result.close();
			const error = request.error?.message;
			if (error) {
				resolve(error);
			} else {
				resolve("Unknown error");
			}
		};
	});
};

const deleteData = (storeName: string, key: string): Promise<boolean> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - deleteData", key);
			db = e?.target?.result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			const res = store.delete(key);
			res.onsuccess = () => {
				resolve(true);
			};
			res.onerror = (e) => {
				(e.target as any).result.close();
				resolve(false);
			};
		};
	});
};

const updateData = <T>(
	storeName: string,
	key: string,
	data: T
): Promise<T | string | null> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - updateData", key);
			db = e?.target?.result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			const res = store.get(key);
			res.onsuccess = () => {
				const newData = { ...res.result, ...data };
				store.put(newData);
				resolve(newData);
			};
			res.onerror = (e) => {
				(e?.target as any).result.close();
				resolve(null);
			};
		};
	});
};

const findOneData = <T>(
	storeName: string,
	key: string
): Promise<T | string | null> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - findOneData", key);
			db = e?.target?.result;
			const tx = db.transaction(storeName, "readonly");
			const store = tx.objectStore(storeName);
			const res = store.get(key);
			res.onsuccess = () => {
				resolve(res.result);
			};
			res.onerror = () => {
				resolve(null);
			};
		};
	});
};

const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - getAllData");
			db = e?.target?.result;
			const tx = db.transaction(storeName, "readonly");
			const store = tx.objectStore(storeName);
			const res = store.getAll();
			res.onsuccess = () => {
				resolve(res.result);
			};
		};

		request.onerror = (e) => {
			(e.target as any).result.close();
			resolve([]);
		};
	});
};

export { initDB, addData, deleteData, updateData, getStoreData, findOneData };
