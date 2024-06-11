'use client';

import React, { useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  TablePagination,
  Paper,
  Box,
  Button,
} from '@mui/material';
import FlexSearch from 'flexsearch';
import getComparator, { Order } from '../sorting';
import DriverTableToolbar from './tableToolbar';
import DriverTableHead from './tableHead';
import { DriverData } from '@/interfaces/driver.interface';
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

export default function DriverTable({
  query,
}: Readonly<{
  query: string;
}>) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DriverData>('name');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [drivers, setDrivers] = useState<Driver[]|[]>([]);
  
  
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

  let driversIds: any = [];
  driversResponse.forEach((response) => {
    driversIds = response['result'];
  })

  const rows = query ? drivers.filter((driver) => driversIds.includes(driver.id)) : drivers;

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
    const driverId = await findOneData(Stores.Drivers, id) as driverResponse;
    const driverIdLiteral = driverId?.id;
    window.location.href = `/motoristas/${driverIdLiteral}`
  }

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof DriverData,
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

  const handleClick = (_: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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
    .toSorted(getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rows, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <DriverTableToolbar numSelected={selected.length} onDeleteSelectedDrivers={() => 	handleDeleteSelectedDrivers(selected)} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <caption>Tabela de cadastro de entradas e saídas</caption>
            <DriverTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <Suspense fallback={<div>Loading...</div>}>
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `Driver-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
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
                        onClick={(event) => handleClick(event, row.id)}
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
                    <TableCell>
                      <Button variant="contained" color="warning" onClick={() => handleEditDriver(row.id)} >
                        editar
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => handleDeleteDriver(row.id)} >
                        Excluir
                      </Button>
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
