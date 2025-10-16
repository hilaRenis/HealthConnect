import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';

const DataTable = ({
                       fetchData,
                       columns,
                       onEdit,
                       onDelete,
                       title,
                       searchPlaceholder = 'Search...'
                   }) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState(columns[0]?.id || '');
    const [order, setOrder] = useState('asc');
    const [search, setSearch] = useState('');

    const loadData = useCallback(async () => {
        try {
            const response = await fetchData({
                page: page + 1,
                limit: rowsPerPage,
                sortBy,
                order,
                search,
            });

            const rows = response.data?.data || [];
            const totalCount = response.data?.total ?? rows.length;

            if (page > 0 && rows.length === 0 && totalCount > 0) {
                setPage((prev) => Math.max(prev - 1, 0));
                return;
            }

            setData(rows);
            setTotal(totalCount);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    }, [fetchData, page, rowsPerPage, sortBy, order, search]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (row) => {
        if (typeof onDelete !== 'function') return;
        try {
            const shouldReload = await onDelete(row);
            if (shouldReload !== false) {
                await loadData();
            }
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const handleSort = (property) => {
        const isAsc = sortBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h6">{title}</Typography>
                <TextField
                    label={searchPlaceholder}
                    variant="outlined"
                    size="small"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.id}>
                                    <TableSortLabel
                                        active={sortBy === col.id}
                                        direction={sortBy === col.id ? order : 'asc'}
                                        onClick={() => handleSort(col.id)}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {(typeof onEdit === 'function' || typeof onDelete === 'function') &&
                                <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                {columns.map((col) => (
                                    <TableCell key={col.id}>{row[col.id]}</TableCell>
                                ))}
                                {(typeof onEdit === 'function' || typeof onDelete === 'function') && (
                                    <TableCell>
                                        {typeof onEdit === 'function' && (
                                            <IconButton onClick={() => onEdit(row)}><Edit/></IconButton>
                                        )}
                                        {typeof onDelete === 'function' && (
                                            <IconButton onClick={() => handleDelete(row)}><Delete/></IconButton>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </Paper>
    );
};

export default DataTable;
