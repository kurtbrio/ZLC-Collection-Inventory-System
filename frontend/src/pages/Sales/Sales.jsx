import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Hamburger from "../../components/Sidebar/Hamburger";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Button,
  Link,
} from "@mui/material";
import authVerification from "../../custom-hooks/authVerification";
import { DeleteOutline, Visibility } from "@mui/icons-material";
import toast from "react-hot-toast";

const Sales = () => {
  authVerification();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("/api/sales");
        setSales(res.data.sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  const formatDate = (date) => {
    const saleDate = new Date(date);
    const formattedDate = saleDate.toLocaleDateString("en-CA");
    return formattedDate;
  };

  const currencyFormatter = (value) => {
    const formatter = new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
    });

    return formatter.format(value);
  };

  const deleteSale = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/sales/${id}`);

      setSales((prevSales) => prevSales.filter((sale) => sale._id !== id));

      toast.success(res.data.success);
    } catch (error) {
      toast.error(res.data.error);
      console.log(error);
    }
  };

  return (
    <>
      <Hamburger />
      <Box
        sx={{
          width: "100vw",
        }}
      >
        <Link href="sales/add">Add Sales</Link>
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
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="center">Value</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No sales available.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell align="center">{sale._id}</TableCell>
                    <TableCell align="center">{sale.productName}</TableCell>
                    <TableCell align="center">
                      {sale.sizes.map((size) =>
                        size.quantity === 0 ? null : (
                          <div key={size.size} className="size-group">
                            {size.size}: {size.quantity}
                          </div>
                        )
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {currencyFormatter(sale.totalPrice)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(sale.date)}
                    </TableCell>
                    <TableCell align="center">
                      <Button>
                        <Visibility />
                      </Button>
                      <Button onClick={() => deleteSale(sale._id)}>
                        <DeleteOutline />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Sales;
