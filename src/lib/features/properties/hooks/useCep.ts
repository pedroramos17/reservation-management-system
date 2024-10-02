"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
	try {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error("Failed to fetch cep");
		}

		return await res.json();
	} catch (e) {
		throw new Error("Failed to fetch cep");
	}
};

export function useCep({
	postalCode,
	shouldFetch,
}: {
	postalCode: string;
	shouldFetch?: boolean;
}) {
	const { data, error, isLoading } = useSWR(
		shouldFetch ? `https://opencep.com/v1/${postalCode}` : null,
		fetcher,
		{ shouldRetryOnError: false }
	);
	return {
		data,
		loading: isLoading,
		error,
	};
}
