export type Order = "asc" | "desc";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (typeof a[orderBy] === "string") {
		if ((a[orderBy] as string).localeCompare(b[orderBy] as string)) {
			return -1;
		}
		if ((b[orderBy] as string).localeCompare(a[orderBy] as string)) {
			return 1;
		}
		return 0;
	}
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export default function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (
	a: { [key in Key]: number | string | boolean },
	b: { [key in Key]: number | string | boolean }
) => number {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}
