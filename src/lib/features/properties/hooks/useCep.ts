"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCep({
	postalCode,
	shouldFetch,
}: {
	postalCode: string;
	shouldFetch?: boolean;
}) {
	const { data, error, isLoading } = useSWR(
		shouldFetch ? `https://opencep.com/v1/${postalCode}` : null,
		fetcher
	);
	return {
		data,
		loading: isLoading,
		error,
	};
}
