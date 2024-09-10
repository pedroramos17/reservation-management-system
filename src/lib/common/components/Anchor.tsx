import { LinkBaseProps } from "@mui/material";
import Link from "next/link";

interface LinkProps extends LinkBaseProps {
    readonly href: string;
    readonly children: React.ReactNode;
}

export default function Anchor(props: LinkProps) {
    const { href, children, ...params } = props;
    return <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }} {...params}>{children}</Link>;
}