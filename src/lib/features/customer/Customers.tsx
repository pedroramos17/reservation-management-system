'use client';

import { useEffect } from 'react';
import FlexSearch from 'flexsearch';
import CustomerTable from '@/lib/features/customer/table';
import SearchTool from '@/lib/common/components/SearchTool';
import { Container, HeaderContainer } from '@/lib/common/components/styles';
import Search from '@/lib/common/components/Search';
import { useAppDispatch, useAppSelector } from "@/lib/common/hooks/hooks"
import { getCustomers, deleteCustomer } from '@/lib/features/customer/customersSlice';
import { Customer } from '@/lib/core/entities';
    
function fetchFilteredCustomers(query: string, customers: Customer[]|[]) {
  const CustomerDocument = new FlexSearch.Document({
    document: {
      id: 'id',
      index: 'name',
    },
    charset: 'latin:advanced',
    tokenize: 'reverse',
    cache: true,
    preset: 'performance',
  })

  for (const customer of customers) {
    CustomerDocument.add({
      id: customer.id,
      name: customer.name,
    })
  }
    
  const results = CustomerDocument.search(query, { suggest: true });

  return results;
}
interface CustomersProps {
  readonly query: string;
}
export default function CustomerPage(props: CustomersProps) {
  const dispatch = useAppDispatch();
  const { entities , loading, error } = useAppSelector((state) => state.customers)
  const { query } = props
  const customersValues = Object.values(entities)
  const customers = customersValues
  const customersResponse = fetchFilteredCustomers(query, customers);

  let searchedCustomersIds: any = [];
  customersResponse.forEach((response) => {
    searchedCustomersIds = response['result'];
  })
  useEffect(() => {
    dispatch(getCustomers())
  }, [dispatch])

  const handleDeleteCustomer = (id: string) => {
      dispatch(deleteCustomer(id))
  }

  const handleDeleteSelectedCustomers = async (selected: string[]) => {}

  return (
    <Container>
      <h1>Motoristas</h1>
      <HeaderContainer>
        <Search placeholder="Pesquisar motoristas" />
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

