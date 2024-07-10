if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/service-worker.js")
		.then((registration) => {
			console.log(
				"Service Worker registered with scope:",
				registration.scope
			);
		})
		.catch((error) => {
			console.error("Service Worker registration failed:", error);
		});
}

self.addEventListener("fetch", (event: any) => {
	event.respondWith(handleIDBRequest(event.request));
});

async function handleIDBRequest(e: any) {
	// Implement your IDB logic here
	// For example, open an IDB connection and retrieve data

	// Example: Get data from an IDB store named 'users'
	let db;
	db = await self.indexedDB.open("myDB");
	if (!db) {
		throw new Error("IndexedDB not available");
	}
	let data: any;
	db.onsuccess = async () => {
		let request = e.target.result;
		const transaction = request.transaction("users", "readonly");
		const store = transaction.objectStore("users");
		data = await store.getAll();
	};

	// Respond with the data (or handle other requests)
	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});
}

const CACHE_VERSION = 1;

self.addEventListener("install", (event) => {
	// Perform installation steps
});

self.addEventListener("activate", (event) => {
	// Clean up old caches if needed
});
