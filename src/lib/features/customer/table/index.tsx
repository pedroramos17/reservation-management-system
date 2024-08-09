'use client';

import React, { useState, Suspense } from 'react';
import {
  Table,
  TableContainer,
  TablePagination,
  Paper,
  Box,
} from '@mui/material';
import { Order } from '@/lib/utils/sorting';
import CustomerTableToolbar from './tableToolbar';
import CustomerTableHead from './tableHead';
import { Customer } from '@/lib/core/entities';
import type { CustomerData } from '@/lib/core/types';
import TableBodyCustom from './tableBody';

export default function CustomerTable({
  query,
  customers,
  handleDeleteSelectedCustomers,
  handleDeleteCustomer,
  searchedCustomersIds,
}: Readonly<{
  query: string;
  customers: Customer[];
  handleDeleteSelectedCustomers: (selectedCustomers: string[]) => Promise<void>;
  handleDeleteCustomer: (id: string) => void;
  searchedCustomersIds: string[];
}>) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CustomerData>('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rows = query ? customers.filter((customer) => searchedCustomersIds.includes(customer.id)) : customers;

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof CustomerData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      console.log(newSelected);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <CustomerTableToolbar numSelected={selected.length} onDeleteSelectedCustomers={() => 	handleDeleteSelectedCustomers(selected)} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <caption>Tabela de cadastro de entradas e saídas</caption>
            <CustomerTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <Suspense fallback={<div>Loading...</div>}>
            <TableBodyCustom
              rows={rows}
              selected={selected}
              setSelected={setSelected}
              page={page}
              rowsPerPage={rowsPerPage}
              order={order}
              orderBy={orderBy}
              handleDeleteCustomer={handleDeleteCustomer}
            />
            </Suspense>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </Paper>
    </Box>
  );
}
