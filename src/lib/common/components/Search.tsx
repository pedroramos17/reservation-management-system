import { TextField, TextFieldProps } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search(props: TextFieldProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('query', value);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <TextField
          sx={{ width: '100%' }}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
          {...props}
        />
    )
}