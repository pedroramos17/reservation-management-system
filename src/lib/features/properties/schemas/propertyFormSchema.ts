import * as Yup from "yup";
import { ChargePer, Property } from "@/lib/db/idb";
import { ParkingLocationType, ParkingPrivacyType } from "../PropertyForm";

const step1ValidationSchema = Yup.object({
	propertyName: Yup.string().required("Obrigatório"),
	propertyCategory: Yup.string(),
	propertyOrganization: Yup.string().nullable(),
});

const step2ValidationSchema = Yup.object({
	checkInFrom: Yup.string(),
	checkOutTo: Yup.string(),
});

const step3ValidationSchema = Yup.object({
	contactInfo: Yup.object({
		physicalLocation: Yup.object({
			address: Yup.object({
				postalCode: Yup.string()
					.max(9, "Max. 9 caracteres")
					.required("Obrigatório"),
				addressLine: Yup.string().required("Obrigatório"),
				number: Yup.number().nullable(),
				addressLine2: Yup.string().nullable(),
				neighborhood: Yup.string().required("Obrigatório"),
				cityName: Yup.string().required("Obrigatório"),
				stateProvinceCode: Yup.string().required("Obrigatório"),
			}),
		}),
	}),
});

type ServicesType = Property["propertyInfo"]["services"];

const step4ValidationSchema = Yup.object({
	services: Yup.array().of(
		Yup.object().shape({
			key: Yup.string(),
			value: Yup.mixed<ServicesType>(),
		})
	),
});

const step5ValidationSchema = Yup.object().shape({
	parkingAvailable: Yup.number()
		.required("Parking availability is required")
		.min(0, "Parking available must be at least 0"),

	parkingChargePer: Yup.mixed<ChargePer>()
		.oneOf(
			["day", "hour", "month", "stay"],
			'Charge per must be either "day" or "hour"'
		)
		.optional(),

	parkingChargeAmount: Yup.number()
		.optional()
		.min(0, "Parking charge amount must be at least 0")
		.typeError("Apenas números")
		.test(
			"is-decimal",
			"Apenas números decimais de duas casas. ex: 9.99",
			(value) => {
				return (
					value === undefined ||
					/^\d+(\.\d{1,2})?$/.test(value.toString())
				);
			}
		),
	reservationsAvailable: Yup.number()
		.required("Reservations available is required")
		.min(0, "Reservations available must be at least 0"),

	parkingLocation: Yup.mixed<ParkingLocationType>()
		.oneOf(
			["onsite", "offsite"],
			'Parking location must be either "onsite" or "offsite"'
		)
		.required("Parking location is required"),

	parkingType: Yup.mixed<ParkingPrivacyType>()
		.oneOf(
			["private", "public"],
			'Parking type must be either "private" or "public"'
		)
		.required("Parking type is required"),
});

export {
	step1ValidationSchema,
	step2ValidationSchema,
	step3ValidationSchema,
	step4ValidationSchema,
	step5ValidationSchema,
};
