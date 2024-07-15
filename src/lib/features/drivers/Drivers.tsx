'use client';

import DriverTable from '@/lib/features/drivers/table';
import SearchTool from '@/lib/common/components/SearchTool';
import { Container, HeaderContainer } from '@/lib/common/components/styles';
import Search from '@/lib/common/components/Search';
import { useEffect, useState } from 'react';
import FlexSearch from 'flexsearch';
import { Driver } from '@/lib/utils/db';
import { useAppDispatch, useAppSelector } from "@/lib/common/hooks/hooks"
import { getDrivers, deleteDriver } from '@/lib/features/drivers/driversSlice';

    
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

export default function DriverPage({
  searchParams,
}: Readonly<{
  searchParams?: {
    query?: string;
  };
}>) {
  const dispatch = useAppDispatch();
  const { entities , loading, error } = useAppSelector((state) => state.drivers)
  const [driversState, setDriversState] = useState<Driver[]|[]>([]);
  const query = searchParams?.query ?? '';
  
  const driversValues = Object.values(entities)
  const drivers = driversValues
  console.log(entities)
  const driversResponse = fetchFilteredDrivers(query, drivers);

  let searchedDriversIds: any = [];
  driversResponse.forEach((response) => {
    searchedDriversIds = response['result'];
  })

  useEffect(() => {
    dispatch(getDrivers())
  }, [dispatch])

  useEffect(() => {
    setDriversState(drivers)
  }, [])



  const handleEditDriver = (id: string) => {
    const selectedDriver = driversState.find((driver) => driver.id === id)
    const driverId = selectedDriver?.id;
    window.location.href = `/motoristas/${driverId}`
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

