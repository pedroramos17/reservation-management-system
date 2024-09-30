"use client";

import useSWR from "swr";

const headers = new Headers();
headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
headers.append("Access-Control-Allow-Credentials", "true");
headers.append("Access-Control-Allow-Origin", "*");
headers.append("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
headers.append(
	"Access-Control-Allow-Headers",
	"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
);

const fetcher = (url: string) =>
	fetch(url, { headers }).then((res) => res.json());

export function useCep({
	postalCode,
	shouldFetch,
}: {
	postalCode: string;
	shouldFetch?: boolean;
}) {
	const { data, error, isLoading } = useSWR(
		shouldFetch ? `https://viacep.com.br/ws/${postalCode}/json/` : null,
		fetcher
	);
	return {
		data,
		loading: isLoading,
		error,
	};
}
