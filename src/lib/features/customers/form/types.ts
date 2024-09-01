export interface CustomerFormValues {
	name: string;
	email: string;
	taxpayerRegistration: string;
	phone: string;
	vehicles: {
		id: string;
		brand: string;
		model: string;
		year: string;
		color: string;
		variant: string;
		licensePlate: string;
	}[];
}
