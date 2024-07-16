import Link from "next/link";

export default function Anchor(props: Readonly<{
    href: string;
    children: React.ReactNode;
}>) {
    const { href, children } = props;
    return <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{children}</Link>;
}