'use client';

import Anchor from '@/lib/common/components/Link';
import Search from '@/lib/common/components/Search';
import GatewayTable from '@/lib/features/gateways/history';
import styled from '@emotion/styled';
import { ArrowBack } from '@mui/icons-material';

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

export default function Page({
  searchParams,
}: Readonly<{
  searchParams?: {
    query?: string;
  };
}>) {
  const query = searchParams?.query ?? '';
  return (
    <Container>
        <Anchor href="/portaria">
          <ArrowBack sx={{ fontSize: 36, color: '#000' }} />
        </Anchor>
        <h1>Histórico de Portarias</h1>
      <Header>
        <Search placeholder="Pesquisar motoristas" />
      </Header>
      <GatewayTable query={query} />
    </Container>
  );
}
