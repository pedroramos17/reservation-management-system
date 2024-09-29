"use server";

import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
	fetch(...args).then((res) => res.json());

export async function useCep(cep: string) {
	const { data, error, isLoading } = useSWR(
		`https://viacep.com.br/ws/${cep}/json/`,
		fetcher
	);
	return {
		data,
		loading: isLoading,
		error,
	};
}
