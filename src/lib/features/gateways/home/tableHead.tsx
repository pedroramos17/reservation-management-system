import React, { MouseEvent } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
  Checkbox,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { GatehouseData } from '@/lib/interfaces/gateway.interface';
import { Order } from '@/lib/utils/sorting';

type Align = 'left' | 'center' | 'right' | 'justify' | 'inherit';

interface HeadCell {
  disablePadding: boolean;
  id: keyof GatehouseData;
  label: string;
  align: Align;
}

const headCells: readonly HeadCell[] = [
  { id: 'name', align: 'left', disablePadding: true, label: 'Nome' },
  { id: 'car', align: 'center', disablePadding: false, label: 'Carro' },
  { id: 'plate', align: 'center', disablePadding: false, label: 'Placa' },
  { id: 'date', align: 'center', disablePadding: false, label: 'Data' },
  { id: 'hour', align: 'center', disablePadding: false, label: 'Hora' },
  { id: 'type', align: 'center', disablePadding: false, label: 'Tipo' },
];

interface GatewayTableProps {
  numSelected: number;
  onRequestSort: (
    event: MouseEvent<unknown>,
    property: keyof GatehouseData,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export default function GatewayTableHead(props: Readonly<GatewayTableProps>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof GatehouseData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
      <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'selecionar todos os motoristas',
            }}
          />
        </TableCell>
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
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}
