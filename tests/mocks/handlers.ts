import { http, HttpResponse } from "msw";

type AddCustomerParams = {
	query: string;
};

type AddCustomerRequestBody = {
	id: string;
	name: string;
	car: string;
	plate: string;
};

type AddCustomerResponseBody = {
	id: string;
};

export const router = {
	replace: jest.fn(),
};
export const handlers = [
	http.post<
		AddCustomerParams,
		AddCustomerRequestBody,
		AddCustomerResponseBody,
		"/motoristas"
	>("/motoristas", async ({ params, request }) => {
		const { query } = params;
		const { id, name, car, plate } = await request.json();

		return HttpResponse.json({
			id,
		});
	}),
];
