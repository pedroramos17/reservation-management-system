'use client';

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
import { Order } from '@/lib/utils/sorting';
import { CustomerData } from '@/lib/core/types';


type Align = 'left' | 'center' | 'right' | 'justify' | 'inherit';

interface HeadCell {
  disablePadding: boolean;
  id: keyof CustomerData;
  label: string;
  align: Align;
}

const headCells: readonly HeadCell[] = [
  { id: 'name', align: 'left', disablePadding: true, label: 'Nome' },
  { id: 'taxpayerRegistration', align: 'center', disablePadding: false, label: 'CPF' },
  { id: 'phone', align: 'center', disablePadding: false, label: 'Telefone' },
];

interface CustomerTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof CustomerData,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export default function CustomerTableHead(props: Readonly<CustomerTableProps>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof CustomerData) => (event: React.MouseEvent<unknown>) => {
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
              active={orderBy === 'name'}
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
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}
