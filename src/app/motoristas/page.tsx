'use client';

import { TextField } from '@mui/material';
import DriverTable from '@/app/components/table/driver';
import SearchTool from '@/app/components/SearchTool';
import { Container, HeaderContainer } from '@/app/components/styles';

export default function Driver() {
  return (
    <Container>
      <h1>Motoristas</h1>
      <HeaderContainer className="flex justify-between items-center">
        <TextField
          placeholder="Pesquisar"
          variant="standard"
          sx={{ width: '100%' }}
        />
        <SearchTool addBtnLink="/motoristas/criar" />
      </HeaderContainer>
      <DriverTable />
    </Container>
  );
}