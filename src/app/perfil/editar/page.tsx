'use client';

import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 32px 40px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 28px;
`;

export default function Profile() {
  let percent = 0 as unknown as string;
  let quota = 0 as unknown as string;
  navigator.storage.estimate().then((estimate) => {
    percent = (
      (estimate.usage as unknown as number) * (100 / (estimate.quota as unknown as number)) *
      100
    ).toFixed(2);
    quota = ((estimate.quota as unknown as number) / 1024 / 1024).toFixed(2) + "MB";
});
  return (
    <Container>
      <h1>Preferências do Perfil</h1>
      <p>
        <h2>Informações do sistema</h2>
        <h3>Armazenamento</h3>
      <label>Você está usando {percent}% do seu armazenamento no total disponível de {quota}.</label>
      </p>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 20,
        }}
      >
        <h2>Informações Pessoais</h2>
        <TextField
          variant="standard"
          type="text"
          name="name"
          id="name"
          label="Nome"
        />
        <TextField
          variant="standard"
          type="text"
          name="email"
          id="email"
          label="Email"
        />
        <h2>Atualizar a Senha</h2>
        <TextField
          variant="standard"
          type="password"
          name="password"
          id="password"
          label="Nova senha"
        />
        <TextField
          variant="standard"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          label="Confirmar Nova senha"
        />
        <Wrapper>
          <Button
            type="submit"
            variant="contained"
            disabled
            sx={{ alignSelf: 'end', width: '195px' }}
          >
            Salvar
          </Button>
        </Wrapper>
      </form>
    </Container>
  );
}
