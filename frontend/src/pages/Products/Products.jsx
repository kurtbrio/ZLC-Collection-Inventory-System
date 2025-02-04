import React, { useEffect, useState } from "react";
import authVerification from "../../custom-hooks/authVerification";
import Hamburger from "../../components/Sidebar/Hamburger";
import {
  Box,
  Link,
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
import axios from "axios";
import { DeleteOutline, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const Products = () => {
  authVerification();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirm) return;

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      console.log(error);
    }
  };

  const currencyFormatter = (value) => {
    return new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const totalValue = (product) => {
    let totalQuantity = 0;
    product.sizes.forEach((size) => {
      totalQuantity += size.quantity;
    });
    return currencyFormatter(totalQuantity * product.price);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedProducts = products.slice().sort(getComparator(order, orderBy));

  const paginatedProducts = sortedProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div id="full">
        <Hamburger />
        <Box id="container">
          <Link href="/products/add">Add Product</Link>

          <TableContainer className="product-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Image</TableCell>
                  <TableCell
                    align="center"
                    sortDirection={orderBy === "id" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
                    sortDirection={orderBy === "name" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
                    sortDirection={orderBy === "gender" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "gender"}
                      direction={orderBy === "gender" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "gender")}
                    >
                      Gender
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
                    sortDirection={orderBy === "category" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "category"}
                      direction={orderBy === "category" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "category")}
                    >
                      Category
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
                    sortDirection={orderBy === "type" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "type"}
                      direction={orderBy === "type" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "type")}
                    >
                      Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="center"
                    sortDirection={orderBy === "price" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "price"}
                      direction={orderBy === "price" ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, "price")}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No products available.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell
                        align="center"
                        style={{
                          width: "150px",
                          height: "150px",
                          minWidth: "130px",
                          minHeight: "130px",
                        }}
                      >
                        <img
                          src={`http://localhost:4000/${product.imageUrl}`}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{product._id}</TableCell>
                      <TableCell align="center">{product.name}</TableCell>
                      <TableCell align="center">{product.gender}</TableCell>
                      <TableCell align="center">{product.category}</TableCell>
                      <TableCell align="center">{product.type}</TableCell>
                      <TableCell align="center">
                        {currencyFormatter(product.price)}
                      </TableCell>
                      <TableCell align="center">
                        {totalValue(product)}
                      </TableCell>
                      <TableCell align="center">
                        <Button onClick={() => navigate(`${product._id}`)}>
                          <Visibility />
                        </Button>
                        <Button
                          onClick={() =>
                            navigate(`/products/update/${product._id}`)
                          }
                        >
                          <Edit />
                        </Button>
                        <Button onClick={() => deleteProduct(product._id)}>
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
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </div>
    </>
  );
};

export default Products;
