'use client';

import { TextField } from "@mui/material";
import styled from "@emotion/styled";
import GatewayTable from "@/app/components/table/gatewayForm";

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

export default function CreateGate() {
    return (
        <Container>
            <h1>Registro da Portaria</h1>
            <Header>
                <TextField
                placeholder="Pesquisar motorista, placa..."
                variant="standard"
                sx={{ width: '100%' }}
                />
            </Header>
            <GatewayTable />
        </Container>
    );
}