'use client';

import GatewayTable from '../components/table/gateway';
import SearchTool from '../components/SearchTool';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';

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
        <h1>Portaria</h1>
      <Header>
        <TextField
          placeholder="Pesquisar"
          variant="standard"
          sx={{ width: '100%' }}
        />
        <SearchTool addBtnLink="/portaria/criar" />
      </Header>
      <GatewayTable />
    </Container>
  );
}
