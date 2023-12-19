'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Checkbox,
  Paper,
  Box,
} from '@mui/material';
import { GatewayData } from '../../../../interfaces/gateway.interface';
import getComparator, { Order } from '../sorting';
import GatewayTableToolbar from './tableToolbar';
import GatewayTableHead from './tableHead';
import { initDB, getStoreData, Driver, Gateway, Stores } from '@/utils/db';

function createData(
  id: string,
  name: string,
  rg: number,
  phone: number,
  plate: string,
  parked: boolean,
): GatewayData {
  return {
    id,
    name,
    rg,
    phone,
    plate,
    parked,
  };
}

interface TabProps {
  tabValue: number;
}

export default function GatewayTable({ tabValue }: Readonly<TabProps>) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof GatewayData>('name');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<Driver[]|[]>([]);
  const [gateways, setGateways] = useState<Gateway[]|[]>([]);

  const handleInitDB = async () => {
    const status = await initDB();
    setIsDBReady(!!status);
  };

  const handleGetDrivers = async () => {
    if (!isDBReady) {
      await handleInitDB();
    }
    const drivers = await getStoreData<Driver>(Stores.Drivers);
    setDrivers(drivers);
  };
  
  const handleGetGateways = async () => {
    if (!isDBReady) {
      await handleInitDB();
    }
    const gateways = await getStoreData<Gateway>(Stores.Gateways);
    setGateways(gateways);
  };

  useEffect(() => {
    handleGetGateways();
  }, [])
  
  const formatedData = {drivers, gateways};
  console.log(formatedData);
const rows = [
  createData('id-1', 'Joaquim', 123456789, 3456256735, 'FEGW-1234', true),
];

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof GatewayData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      rows
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .sort(getComparator(order, orderBy))
        .filter((row) => (tabValue === 0 ? row.parked : !row.parked)),
    [order, orderBy, page, rowsPerPage, tabValue],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <GatewayTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <caption>Tabela de cadastro de entradas e saídas</caption>
            <GatewayTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length }
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `gateway-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.rg}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                    <TableCell align="center">{row.plate}</TableCell>
                    <TableCell align="center">
                      {row.parked ? 'sim' : 'não'}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
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
        />
      </Paper>
    </Box>
  );
}
