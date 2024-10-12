import { rest } from "msw";

export const router = {
	replace: jest.fn(),
};

export const handlers = [
	rest.get("/", (req, res, ctx) => {
		return res(router.replace("/propriedades"));
	}),
];
