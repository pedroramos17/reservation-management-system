import 'client-only';
import React from 'react';
import { render, screen } from '../../../test-utils';
import CustomerList, { searchCustomers } from '@/lib/features/customers/CustomerList';
import { Customer } from '@/lib/db/idb';

describe('CustomerList Component', () => {
  it('renders without crashing', () => {
      render(<CustomerList query=''/>);
      expect(screen.getByText(/Motoristas/i)).toBeInTheDocument();
  });

});

describe('searchCustomers function', () => {
    const customers: Customer[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'jdoe@me.com',
        phone: null,
        taxpayerRegistration: null,
        updatedAt: null,
      },
      {
        id: '2',
        name: 'Mary Jane',
        email: 'mjane@me.com',
        phone: null,
        taxpayerRegistration: null,
        updatedAt: null,
      },
  ];

  it('returns empty array with empty query', () => {
    const query = '';
    const results = searchCustomers(query, customers);
    expect(results[0]['result']).toStrictEqual([]);
  });

  it('returns customer with exact name match', () => {
    const query = 'John Doe';
    const results = searchCustomers(query, customers);
    console.log('results: ', results);
    expect(results[0].result).toStrictEqual(customers[0].id);
  });

  it('returns customers with partial name match', () => {
    const query = 'Doe';
    const results = searchCustomers(query, customers);
    expect(results[0].result).toStrictEqual(customers[0].id);

  });

  it('returns empty result with non-existent customer name', () => {
    const query = 'Unknown Customer';
    const results = searchCustomers(query, customers);
    expect(results[0].result).toStrictEqual([]);
  });
});