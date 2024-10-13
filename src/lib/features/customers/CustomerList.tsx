'use client';
import 'client-only';
import { useEffect } from 'react';
import FlexSearch from 'flexsearch';
import CustomerTable from '@/lib/features/customers/table';
import SearchTool from '@/lib/common/components/SearchTool';
import { Container, HeaderContainer, Title } from '@/lib/common/components/styles';
import Search from '@/lib/common/components/Search';
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { getCustomersAsync, deleteCustomerAsync, selectAllCustomers } from '@/lib/features/customers/customersSlice';
import type { Customer } from '@/lib/db/idb';
import { deleteVehiclesAsync } from '../vehicles/vehiclesSlice';
import { getVehiclesByCustomerId } from '@/lib/repositories/vehicleRepository';
    
 export function searchCustomers(query: string, customers: Customer[]) {
  const customerDocument = new FlexSearch.Document({
    document: {
      id: 'id',
      index: 'name',
    },
    charset: 'latin:advanced',
    tokenize: 'reverse',
    cache: true,
    preset: 'performance',
  });

  for (const customer of customers) {
    customerDocument.add({
      id: customer.id,
      name: customer.name,
    });
  }

  const results = customerDocument.search(query, { suggest: true });

  return results;
};

interface CustomersProps {
  readonly query: string;
}
export default function CustomerList(props: CustomersProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (Window !== undefined) {
      dispatch(getCustomersAsync())
    } 
  }, [dispatch])
  const customers = useAppSelector((state) => selectAllCustomers(state));
  const { query } = props;
  const customersResponse = searchCustomers(query, customers);
  console.log("customersResponse: ", customersResponse)
  
  let searchedCustomersIds: any = [];
  customersResponse.forEach((response) => {
    searchedCustomersIds = response['result'];
  })
  
  async function handleDeleteCustomer(customerId: string) {
        const customerVehicles = await getVehiclesByCustomerId(customerId)
        const hasVehicles = customerVehicles && customerVehicles.length > 0;
        if (hasVehicles) {
          const vehicleIds = customerVehicles.map(vehicle => vehicle.id);
          console.log("vehicles: ", customerVehicles)
          console.log("vehicle ids: ", vehicleIds)
          await dispatch(deleteVehiclesAsync(vehicleIds));
        }
        await dispatch(deleteCustomerAsync(customerId));
  };
  const handleDeleteSelectedCustomers = async (selected: string[]) => {}

  return (
    <Container>
      <Title>Motoristas</Title>
      <HeaderContainer>
        <Search variant="standard" placeholder="Pesquisar motoristas" />
        <SearchTool addBtnLink="/motoristas/criar" />
      </HeaderContainer>
      <CustomerTable
        query={query}
        customers={customers}
        handleDeleteSelectedCustomers={handleDeleteSelectedCustomers}
        handleDeleteCustomer={handleDeleteCustomer}
        searchedCustomersIds={searchedCustomersIds}
      /> 
    </Container>
  );
}

