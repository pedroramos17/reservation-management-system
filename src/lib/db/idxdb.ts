import { Stores } from "@/lib/core/entities";

type DataType<T> = T | string | null;

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 2;

const storesString = Object.values(Stores);
const DB_NAME = "barkin";

interface ConfigureIdxDBProps {
	dbName: string;
	version: number;
}

interface UpgradeCallbackOptions {
	db: IDBDatabase;
	request: IDBOpenDBRequest;
	upgradable: (schemas: IndexedDBStore[]) => boolean;
}

const openDB = (
	props: ConfigureIdxDBProps
): Promise<IDBOpenDBRequest | null> => {
	const { dbName, version } = props;
	return new Promise((resolve) => {
		// open the connection
		if (!window) {
			console.error("window is undefined");
			resolve(null);
		}
		request = window.indexedDB.open(dbName, version);
		resolve(request);
	});
};

type UpgradeCallback = (options: UpgradeCallbackOptions) => void;
const upgradeCallback = () => {};
const configureIdxDB = (
	props: ConfigureIdxDBProps
): Promise<IDBDatabase | null> => {
	return new Promise((resolve) => {
		// open the connection
		request.onblocked = (e: any) => {
			console.log("request.onblocked", e);
			e.target.result.close();
		};
		request.onupgradeneeded = (e: any) => {
			if (e.oldVersion === 0) {
				upgradeCallback!(false);
			} else {
				upgradeCallback!(true);
			}
			db = e.target.result;

			// if the data object store doesn't exist, create it
			storesString.forEach((s) => {
				if (!db.objectStoreNames.contains(s)) {
					db.createObjectStore(s, { keyPath: "id" });
				}
			});
			// no need to resolve here
		};

		request.onsuccess = (e: any) => {
			upgradeCallback!(true);
			db = e.target.result;
			console.log("request.onsuccess - initDB " + version);
			resolve(db);
		};

		request.onerror = (e: any) => {
			upgradeCallback!(false);
			console.log("request.onerror - initDB", e);
			e.target.result.close();
			resolve(null);
		};
	});
};

const createEntity = (storeName: string) => {
	return new Promise((resolve) => {});
};

const storeNameIterator: Iterator<string> = storesString.values();

const addData = <T>(storeName: string, data: T): Promise<DataType<T>> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - addData", data);
			db = (e.target as any).result;
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
				resolve("Unknown error in addData");
			}
		};
	});
};

const deleteData = (storeName: string, key: string): Promise<string> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - deleteData", key);
			db = (e.target as any).result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);
			const res = store.delete(key);
			res.onsuccess = () => {
				resolve(key);
			};
			res.onerror = (e) => {
				(e.target as any).result.close();
				const error = request.error?.message;
				if (error) {
					resolve(error);
				} else {
					resolve("Unknown error in deleteData");
				}
			};
		};
	});
};

const deleteManyData = (
	storeName: string,
	keys: string[]
): Promise<boolean> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - deleteManyData", keys);
			db = (e.target as any).result;
			const tx = db.transaction(storeName, "readwrite");
			const store = tx.objectStore(storeName);

			store.openCursor().onsuccess = (e) => {
				const cursor = (e.target as any).result;
				if (cursor) {
					if (keys.includes(cursor.primaryKey)) {
						cursor.delete();
					}
					cursor.continue();
				}
				cursor.onsuccess = () => {
					resolve(true);
				};
				cursor.onerror = (e: any) => {
					e.target.result.close();
					resolve(false);
				};
			};
		};
	});
};

const updateData = <T>(
	storeName: string,
	key: string,
	data: T
): Promise<DataType<T>> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - updateData", key);
			db = (e.target as any).result;
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
): Promise<DataType<T>> => {
	return new Promise((resolve) => {
		request = window.indexedDB.open(DB_NAME, version);

		request.onsuccess = (e) => {
			console.log("request.onsuccess - findOneData", key);
			db = (e.target as any).result;
			const tx = db.transaction(storeName, "readonly");
			const store = tx.objectStore(storeName);
			const res = store.get(key);
			res.onsuccess = () => {
				resolve((res as any).result);
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
			db = (e.target as any).result;
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

export {
	configureIdxDB,
	addData,
	deleteData,
	updateData,
	getStoreData,
	findOneData,
	deleteManyData,
};
