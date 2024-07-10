'use client';

import styled from "@emotion/styled";
import GatewayTable from "@/lib/common/components/table/gatewayForm";
import Search from "../../lib/common/components/Search";

const Container = styled.div`
  overflow: auto;
  padding: 16px 24px;
  gap: 24px;
`;

const Header = styled.header`
  width: '100%';
  display: flex;
  align-items: end;
  padding: 24px 0;
`;

export default function CreateGate({
  searchParams,
}: Readonly<{
  searchParams?: {
    query?: string;
  };
}>) {
  const query = searchParams?.query ?? '';
    return (
        <Container>
            <h1>Registro da Portaria</h1>
            <Header>
                <Search placeholder="Pesquisar motoristas" />
            </Header>
            <GatewayTable query={query} />
        </Container>
    );
}