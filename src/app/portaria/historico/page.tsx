'use client';

import GatewayTable from '@/app/components/table/gateway';
import styled from '@emotion/styled';
import { ArrowBack } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';

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

export default function Gateway() {
  return (
    <Container>
        <IconButton LinkComponent="a" href="/portaria">
          <ArrowBack sx={{ fontSize: 36, color: '#000' }} />
        </IconButton>
        <h1>Histórico de Portarias</h1>
      <Header>
        <TextField
          placeholder="Pesquisar"
          variant="standard"
          sx={{ width: '100%' }}
        />
      </Header>
      <GatewayTable />
    </Container>
  );
}
