'use client';

import DriverTable from '@/app/components/table/driver';
import SearchTool from '@/app/components/SearchTool';
import { Container, HeaderContainer } from '@/app/components/styles';
import Search from '../components/Search';

export default function Driver({
  searchParams,
}: Readonly<{
  searchParams?: {
    query?: string;
  };
}>) {
  const query = searchParams?.query ?? '';
  return (
    <Container>
      <h1>Motoristas</h1>
      <HeaderContainer className="flex justify-between items-center">
        <Search />
        <SearchTool addBtnLink="/motoristas/criar" />
      </HeaderContainer>
      <DriverTable query={query} /> 
    </Container>
  );
}