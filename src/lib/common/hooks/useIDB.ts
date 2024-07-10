import { useEffect, useReducer, useState } from "react";

enum ActionTypes {
	GET,
	ADD,
	UPDATE,
	DELETE,
}

enum Stores {
	Drivers = "drivers",
	Gateways = "gateways",
	Vehicles = "vehicles",
}

interface IDB<T> {
	action: ActionTypes;
	store: Stores;
	data: T | null;
}

interface IDBState<T> {
	data: T | null;
	error: string | null;
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

function useSchema(schemas: IndexedDBStore[]) {
	const [stores, setStores] = useState<IndexedDBStore[]>([]);
	setStores(schemas);
	return stores;
}

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

const useUpgradeCallback = (_: Event, db: IDBDatabase) => {
	const stores = useSchema(schemas);
	stores.forEach((s) => {
		if (!db.objectStoreNames.contains(s.name)) {
			const store = db.createObjectStore(s.name, s.id);
			s.indices.forEach((c) => {
				store.createIndex(c.name, c.keyPath, c.options);
			});
		}
	});
};
const idbReducer = <T>(
	state: IDBState<T>,
	action: { type: ActionTypes; payload?: T }
): IDBState<T> => {
	switch (action.type) {
		case ActionTypes.GET:
			// Implement your GET logic here
			return { ...state };
		case ActionTypes.ADD:
			// Implement your ADD logic here
			return { ...state };
		case ActionTypes.UPDATE:
			// Implement your UPDATE logic here
			return { ...state };
		case ActionTypes.DELETE:
			// Implement your DELETE logic here
			return { ...state };
		default:
			return state;
	}
};

export const useIDB = <T>(props: IDB<T>) => {
	const { action, store, data } = props;

	const initialState: IDBState<T> = {
		data: null,
		error: null,
	};

	const [state, dispatch] = useReducer(idbReducer, initialState);

	useEffect(() => {
		// Initialize the database and perform other setup
		// ...

		// Example: Dispatch an action to get data
		if (action === ActionTypes.GET) {
			dispatch({ type: ActionTypes.GET });
			// Implement your GET logic here
		}

		// Other actions (ADD, UPDATE, DELETE) can be handled similarly

		// Cleanup (e.g., close database connection) when component unmounts
		return () => {
			// Cleanup logic
		};
	}, [action]);

	// Return relevant data and methods
	return {
		data: state.data,
		error: state.error,
		// Add other methods for interacting with IndexedDB
		// ...
	};
};
