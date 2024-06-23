'use client';

import DriverTable from '@/app/components/table/driver';
import SearchTool from '@/app/components/SearchTool';
import { Container, HeaderContainer } from '@/app/components/styles';
import Search from '../components/Search';
import { useCallback, useEffect, useState } from 'react';
import FlexSearch from 'flexsearch';
import { initDB, getStoreData, deleteData, Driver, Stores, findOneData, deleteManyData } from '@/utils/db';


type driverResponse = {
  id: string;
  name: string;
  rg: string;
  phone: string;
  vehicles: {
    brand?: string;
    model?: string;
    year?: string;
    color?: string;
    plate?: string;
  }
}

export default function Page({
  searchParams,
}: Readonly<{
  searchParams?: {
    query?: string;
  };
}>) {
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<Driver[]|[]>([]);
  const query = searchParams?.query ?? '';

    
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
  
  const driversResponse = fetchFilteredDrivers(query, drivers);

  let searchedDriversIds: any = [];
  driversResponse.forEach((response) => {
    searchedDriversIds = response['result'];
  })

  const handleInitDB = useCallback(async () => {
    const status = await initDB();
    setIsDBReady(!!status);
  }, [setIsDBReady]);
  
  const handleGetDrivers = useCallback(async () => {
    if (!isDBReady) {
      await handleInitDB();
    }
    const drivers = await getStoreData<Driver>(Stores.Drivers);
    setDrivers(drivers);
  }, [isDBReady, handleInitDB]);

  useEffect(() => {
    handleGetDrivers();
  }, [handleGetDrivers])

  const handleDeleteDriver = async (id: string) => {
    if (!isDBReady) {
      await handleInitDB();
    }
    try {
      await deleteData(Stores.Drivers, id);
      // refetch drivers after deleting data
      handleGetDrivers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const handleEditDriver = async (id: string) => {
    const driverResponse = await findOneData(Stores.Drivers, id) as driverResponse;
    const driverId = driverResponse?.id;
    window.location.href = `/motoristas/${driverId}`
  }

  const handleDeleteSelectedDrivers = async (selected: string[]) => {
    if (!isDBReady) {
      await handleInitDB();
    }
    try {
      console.log(selected);
      await deleteManyData(Stores.Drivers, selected);
      // refetch drivers after deleting data
      handleGetDrivers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }


  return (
    <Container>
      <h1>Motoristas</h1>
      <HeaderContainer className="flex justify-between items-center">
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