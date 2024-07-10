import React from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { GatehouseData } from '@/lib/interfaces/gateway.interface';
import { Order } from '../sorting';

type Align = 'left' | 'center' | 'right' | 'justify' | 'inherit';

interface HeadCell {
  id: keyof GatehouseData;
  disablePadding: boolean;
  align: Align;
  label: string;
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
    event: React.MouseEvent<unknown>,
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
              'aria-label': 'selecionar todas as movimentações',
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
      </TableRow>
    </TableHead>
  );
}
