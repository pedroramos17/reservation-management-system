'use client';

import { toZonedTime, format } from "date-fns-tz";
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
  Button,
} from '@mui/material';
import { GatehouseData } from '@/lib/interfaces/gateway.interface';
import getComparator, { Order } from '@/lib/utils/sorting';
import GatewayTableToolbar from './tableToolbar';
import GatewayTableHead from './tableHead';
import { Driver, Gateway } from '@/lib/utils/db';
import dateParseBr from '@/lib/utils/date';
import { useAppDispatch, useAppSelector } from "@/lib/common/hooks/hooks";
import { getGateways } from '@/lib/features/gateways/gatewaySlice';
import { getDrivers } from "../../drivers/driversSlice";
import mergeGatewaysWithDrivers from "../utils";
import fetchFilteredDrivers from "@/lib/utils/search";

export default function GatewayTable({
  query,
}: Readonly<{
  query: string;
}>) {
  const dispatch = useAppDispatch();
  const { drivers, gateways } = useAppSelector((state) => state);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof GatehouseData>('name');
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [gatewayFormData, setGatewayFormData] = useState<Gateway>({
    id: "",
    parked: false,
    driverId: "",
    vehicleId: "",
    createdAt: "",
  })

  const driversValues = Object.values(drivers.entities);
  const gatewaysValues = Object.values(gateways.entities);

  const date = new Date("2018-09-01T16:01:36.386Z");
  const timeZone = "Europe/Berlin";
  const zonedDate = toZonedTime(date, timeZone);

  const pattern = "d.M.yyyy HH:mm:ss.SSS 'GMT' XXX (z)";
  const output = format(zonedDate, pattern, { timeZone: "Europe/Berlin" })
  console.log(output)

  const gatewaysData = mergeGatewaysWithDrivers(gatewaysValues, driversValues);

  const driversResponse = fetchFilteredDrivers(query, driversValues);

  let driversIds: any = [];
  driversResponse.forEach((response) => {
    driversIds = response['result'];
  })

  const rows = query ? gatewaysData.filter((gatewaysData) => driversIds.includes(gatewaysData.driverId)) : gatewaysData;

  useEffect(() => {
    dispatch(getDrivers())
    dispatch(getGateways())
  }, [dispatch])

  const handleGatewayDriver = (driverId: string) => {
    /**
     * Pseudo code
     * 
     * Implement a logic like create a new entry and
     *  new exit to save timestamp where is so important
     *  to log and tie spent controller.
     * 
     * filter only drivers that are parked to register the exit
     * and the driver that is not parked to register the entry
     * 
     */
    let uuid = self.crypto.randomUUID();

    const driverResponse = driversValues.find((driver) => driver.id === driverId) as Driver;
    
    if (driverResponse) {
      const driverId = driverResponse.id;

      const driverWithGateway = gatewaysValues.filter((gateway) => gateway.driverId === driverId);
      const lastDriverWithGateway = driverWithGateway.at(-1);
      if (lastDriverWithGateway) {
        setGatewayFormData({
          id: uuid,
          parked: !lastDriverWithGateway.parked,
          driverId: lastDriverWithGateway.driverId,
          vehicleId: lastDriverWithGateway.vehicleId,
          createdAt: dateParseBr(new Date()),
        })
        console.log(lastDriverWithGateway);
        }
      }
    }
  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof GatehouseData,
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
        .toSorted(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage],
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
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `gateway-table-checkbox-${index}`;

                return (
                  <TableRow
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
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
                    <TableCell align="center">{row.car}</TableCell>
                    <TableCell align="center">{row.plate}</TableCell>
                    <TableCell align="center">{row.date}</TableCell>
                    <TableCell align="center">{row.hour}</TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleGatewayDriver(row.id)} >
                        {row.type === 'Entrada' ? 'Registrar saída' : 'Registrar entrada'}
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
