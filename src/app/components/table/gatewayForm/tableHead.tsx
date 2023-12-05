import React, { MouseEvent } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { GatewayData } from '../../../../interfaces/gateway.interface';
import { Order } from '../sorting';

type Align = 'left' | 'center' | 'right' | 'justify' | 'inherit';

interface HeadCell {
  disablePadding: boolean;
  id: keyof GatewayData;
  label: string;
  align: Align;
}

const headCells: readonly HeadCell[] = [
  { id: 'name', align: 'left', disablePadding: true, label: 'Nome' },
  { id: 'rg', align: 'center', disablePadding: false, label: 'RG' },
  { id: 'phone', align: 'center', disablePadding: false, label: 'Telefone' },
  { id: 'plate', align: 'center', disablePadding: false, label: 'Placa' },
  { id: 'parked', align: 'center', disablePadding: false, label: 'Estacionou' },
];

interface GatewayTableProps {
  numSelected: number;
  onRequestSort: (
    event: MouseEvent<unknown>,
    property: keyof GatewayData,
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export default function GatewayTableHead(props: Readonly<GatewayTableProps>) {
  const {
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof GatewayData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
