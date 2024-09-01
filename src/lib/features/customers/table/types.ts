import { Customer } from "@/lib/db/idb";

export type CustomerData = Pick<
	Customer,
	"name" | "taxpayerRegistration" | "phone"
>;
