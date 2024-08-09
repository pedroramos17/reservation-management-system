enum Stores {
	Drivers = "drivers",
	Gateways = "gateways",
	Vehicles = "vehicles",
}

export interface IndexedDBColumn {
	name: string;
	keyPath: string;
	options?: IDBIndexParameters;
}

export interface IndexedDBStore {
	name: Stores;
	id: IDBObjectStoreParameters;
	indices: IndexedDBColumn[];
}

const schemas: IndexedDBStore[] = [
	{
		name: Stores.Drivers,
		id: { keyPath: "id" },
		indices: [
			{ name: "name", keyPath: "name" },
			{ name: "rg", keyPath: "rg", options: { unique: true } },
			{ name: "phone", keyPath: "phone" },
		],
	},
	{
		name: Stores.Vehicles,
		id: { keyPath: "id" },
		indices: [
			{ name: "brand", keyPath: "brand" },
			{ name: "model", keyPath: "model" },
			{ name: "year", keyPath: "year" },
			{ name: "color", keyPath: "color" },
			{ name: "plate", keyPath: "plate", options: { unique: true } },
		],
	},
	{
		name: Stores.Gateways,
		id: { keyPath: "id" },
		indices: [
			{ name: "name", keyPath: "name" },
			{ name: "rg", keyPath: "rg", options: { unique: true } },
			{ name: "phone", keyPath: "phone" },
		],
	},
];
export interface IndexedDBConfig {
	dbName: string;
	version: number;
	upgradeCallback?: (e: Event, db: IDBDatabase) => void;
}

const indexedDB: IDBFactory = window.indexedDB;

function con(config?: IndexedDBConfig): Promise<IDBDatabase> {
	const { dbName, version, upgradeCallback } = config || {};
	if (!dbName || !version) {
		throw new Error("Database name and version are required");
	}
	const request = indexedDB.open(dbName, version);
	let db: IDBDatabase;
	return new Promise<IDBDatabase>((resolve, reject) => {
		request.onsuccess = () => {
			db = request.result;
			resolve(db);
		};
		request.onerror = () => {
			reject(new Error(`IndexedDB error: ${request.error}`));
		};
		request.onblocked = () => {
			request.result.close();
			reject(new Error("request.onblocked"));
		};
		if (typeof upgradeCallback === "function") {
			request.onupgradeneeded = (event: Event) => {
				upgradeCallback(event, db);
			};
		}
	}).finally(() => {
		db.close();
	});
}

const upgradeCallback = (db: IDBDatabase, stores: IndexedDBStore[]) => {
	stores.forEach((s) => {
		if (!db.objectStoreNames.contains(s.name)) {
			const store = db.createObjectStore(s.name, s.id);
			s.indices.forEach((c) => {
				store.createIndex(c.name, c.keyPath, c.options);
			});
		}
	});
};
