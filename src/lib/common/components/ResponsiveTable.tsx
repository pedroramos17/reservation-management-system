'use client';

import { styled } from '@mui/material';
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

const Separator = styled('div')({
  position: 'absolute',
  top: '0',
  bottom: '0',
  zIndex: 10,
  width: '36px',
})

interface Column {
  id: string;
  label: string;
  isSorted: boolean;
  isResizable: boolean;
  width: number;
  minWidth?: number;
  maxWidth?: number;
}

interface ResponsiveTableProps<T> {
  columns: Column[];
  data: T[];
  storageKey?: string;
  toolbarTitle?: string;
}
type SortDirection = 'asc' | 'desc' | null;
const ResponsiveTable = <T extends Record<string, any>>({ 
    columns, 
    data, 
    storageKey,
    toolbarTitle,
  }: ResponsiveTableProps<T>)  => {
    const [columnWidths, setColumnWidths] = useState<number[]>(() => {
        const savedWidths = storageKey ? localStorage.getItem(storageKey): null;
        return savedWidths ? JSON.parse(savedWidths) : columns.map((col) => col.width);
    });
    
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [initialMouseX, setInitialMouseX] = useState<number | null>(null);
  const [initialColumnWidth, setInitialColumnWidth] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(columnWidths));
  }, [columnWidths, storageKey]);


  const handleMouseDown = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingIndex(index);
      setInitialMouseX(e.clientX);
      setInitialColumnWidth(columnWidths[index]);
    },
    [columnWidths]
  );

  const handleDoubleClick = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];
        newWidths[index] = columns[index].width;
        return newWidths;
      });
    },
    [columns]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (resizingIndex === null || initialMouseX === null || initialColumnWidth === null || !tableRef.current) return;

      const deltaX = e.clientX - initialMouseX;
      const newWidth = initialColumnWidth + deltaX + (columnWidths[resizingIndex] - initialColumnWidth);
      setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];
        const column = columns[resizingIndex];
        const minWidth = column.minWidth ?? 50;
        const maxWidth = column.maxWidth ?? Infinity;
        newWidths[resizingIndex] = Math.min(Math.max(minWidth, newWidth), maxWidth);
        return newWidths;
      });
    },
    [resizingIndex, initialMouseX, initialColumnWidth, columns]
  );

  const handleMouseUp = useCallback(() => {
    setResizingIndex(null);
    setInitialMouseX(null);
    setInitialColumnWidth(null);
  }, []);

  useEffect(() => {
    if (resizingIndex !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingIndex, handleMouseMove, handleMouseUp]);


  const handleSort = useCallback(
    (columnId: keyof T) => () => {
      setSortDirection((prevDirection) => {
        if (sortColumn !== columnId) return 'asc';
        const newDirection = prevDirection === 'asc' ? 'desc' : prevDirection === 'desc' ? null : 'asc';
        return newDirection;
      });
      setSortColumn(columnId);
    },
    [sortColumn]
  );

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <div
      style={{
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#fafafa',
        width: '100%',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }}>
      <div>
        <h3 style={{ paddingLeft: '16px',}}>{toolbarTitle && toolbarTitle}</h3>
      </div>
        <table
            ref={tableRef}
            style={{
                overflowX: 'auto',
                borderCollapse: 'separate', 
                borderSpacing: 0,
                width: '100%',
            }}
        >
        <thead>
            <tr
              style={{
              }}
            >
            {columns.map((column, index) => (
                <th
                key={column.id}
                style={{
                    position: 'relative',
                    width: column.isResizable ? `${columnWidths[index]}px` : column.width,
                    padding: '16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    borderRight: '2px solid rgba(0, 0, 0, 0.12)',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: 'rgba(0, 0, 0, 0.87)',
                    cursor: column.isSorted ? 'pointer' : 'default',
                    userSelect: 'none',
                }}
                tabIndex={-1}
                onClick={column.isSorted ? handleSort(column.id): undefined}
                >
                    <div
                      style={{
                        alignItems: 'left',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
                {column.label}
                {sortColumn === column.id && (
                        <span style={{ marginLeft: '8px', flexShrink: 1 }}>
                        {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : ''}
                        </span>
                    )}
                </div>
                <Separator
                  role='separator'
                  aria-label="Column resize handle"
                  aria-roledescription="separator"
                  tabIndex={-1}
                  onMouseDown={column.isResizable ? handleMouseDown(index) : undefined}
                  onDoubleClick={column.isResizable ? handleDoubleClick(index) : undefined}
                  style={{
                    cursor: column.isResizable ? 'grab' : 'default',
                    right: column.isResizable ? '-18px' : 0,
                  }}
                />
                </th>
            ))}
            </tr>
        </thead>
        <tbody>
            {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                <td
                    key={column.id}
                    style={{
                    width: `${columnWidths[colIndex]}px`,
                    padding: '8px',
                    borderRight: '1px solid #ccc',
                    }}
                >
                    {row[column.id]}
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default ResponsiveTable;