import FlexSearch from "flexsearch";
import { Driver } from "@/lib/utils/db";

function fetchFilteredDrivers(query: string, drivers: Driver[] | []) {
	const DriverDocument = new FlexSearch.Document({
		document: {
			id: "id",
			index: "name",
		},
		charset: "latin:advanced",
		tokenize: "reverse",
		cache: true,
		preset: "performance",
	});

	for (const driver of drivers) {
		DriverDocument.add({
			id: driver.id,
			name: driver.name,
		});
	}

	const results = DriverDocument.search(query, { suggest: true });

	return results;
}

export default fetchFilteredDrivers;
