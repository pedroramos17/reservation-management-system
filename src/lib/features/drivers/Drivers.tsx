'use client';

import { useEffect } from 'react';
import FlexSearch from 'flexsearch';
import DriverTable from '@/lib/features/drivers/table';
import SearchTool from '@/lib/common/components/SearchTool';
import { Container, HeaderContainer } from '@/lib/common/components/styles';
import Search from '@/lib/common/components/Search';
import { useAppDispatch, useAppSelector } from "@/lib/common/hooks/hooks"
import { getDrivers, deleteDriver } from '@/lib/features/drivers/driversSlice';
import { Driver } from '@/lib/utils/db';
    
function fetchFilteredDrivers(query: string, drivers: Driver[]|[]) {
  const DriverDocument = new FlexSearch.Document({
    document: {
      id: 'id',
      index: 'name',
    },
    charset: 'latin:advanced',
    tokenize: 'reverse',
    cache: true,
    preset: 'performance',
  })

  for (const driver of drivers) {
    DriverDocument.add({
      id: driver.id,
      name: driver.name,
    })
  }
    
  const results = DriverDocument.search(query, { suggest: true });

  return results;
}
interface DriversProps {
  readonly query: string;
}
export default function DriverPage(props: DriversProps) {
  const dispatch = useAppDispatch();
  const { entities , loading, error } = useAppSelector((state) => state.drivers)
  const { query } = props
  const driversValues = Object.values(entities)
  const drivers = driversValues
  const driversResponse = fetchFilteredDrivers(query, drivers);

  let searchedDriversIds: any = [];
  driversResponse.forEach((response) => {
    searchedDriversIds = response['result'];
  })
  useEffect(() => {
    dispatch(getDrivers())
  }, [dispatch])

  const handleEditDriver = (id: string) => {
    window.location.href = `/motoristas/${entities[id].id}`
  }

  const handleDeleteDriver = (id: string) => {
      dispatch(deleteDriver(id))
  }

  const handleDeleteSelectedDrivers = async (selected: string[]) => {}

  return (
    <Container>
      <h1>Motoristas</h1>
      <HeaderContainer>
        <Search placeholder="Pesquisar motoristas" />
        <SearchTool addBtnLink="/motoristas/criar" />
      </HeaderContainer>
      <DriverTable
        query={query}
        drivers={drivers}
        handleDeleteSelectedDrivers={handleDeleteSelectedDrivers}
        handleEditDriver={handleEditDriver}
        handleDeleteDriver={handleDeleteDriver}
        searchedDriversIds={searchedDriversIds}
      /> 
    </Container>
  );
}

