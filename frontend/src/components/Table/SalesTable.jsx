import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Button,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { DeleteOutline, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SalesTable = ({ sales, deleteSale }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedSales = sales.slice().sort(getComparator(order, orderBy));
  const paginatedSales = sortedSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const currencyFormatter = (value) => {
    return new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const formatDate = (date) => {
    const saleDate = new Date(date);
    return saleDate.toLocaleDateString("en-CA");
  };

  const handleDeleteSale = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this sale?"
    );

    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/sales/${id}`);

      deleteSale(id);

      toast.success(res.data.success);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-96">
      <TableContainer
        sx={{
          width: "100%",
          maxWidth: "100vw",
          overflowX: "auto",
          textWrap: "nowrap",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell
                align="center"
                sortDirection={orderBy === "productName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "productName"}
                  direction={orderBy === "productName" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "productName")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell
                align="center"
                sortDirection={orderBy === "totalPrice" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "totalPrice"}
                  direction={orderBy === "totalPrice" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "totalPrice")}
                >
                  Value
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="center"
                sortDirection={orderBy === "date" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No sales available.
                </TableCell>
              </TableRow>
            ) : (
              paginatedSales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell align="center">{sale._id}</TableCell>
                  <TableCell align="center">{sale.productName}</TableCell>
                  <TableCell align="center">
                    {sale.sizes
                      .filter((size) => size.quantity !== 0)
                      .map((size) => (
                        <div key={size.size} className="size-group">
                          {size.size}: {size.quantity}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell align="center">
                    {currencyFormatter(sale.totalPrice)}
                  </TableCell>
                  <TableCell align="center">{formatDate(sale.date)}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleDeleteSale(sale._id)}>
                      <DeleteOutline />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={sales.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default SalesTable;
