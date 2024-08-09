import { Customer } from "./entities";

export type CustomerData = Pick<
	Customer,
	"name" | "taxpayerRegistration" | "phone"
>;
