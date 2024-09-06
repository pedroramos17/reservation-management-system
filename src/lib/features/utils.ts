export type AtLeastOne<T extends Record<string, any>> = keyof T extends infer K
	? K extends string
		? Pick<T, K & keyof T> & Partial<T>
		: never
	: never;
