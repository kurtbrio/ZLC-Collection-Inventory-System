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
} from "@mui/material";
import axios from "axios";
import { DeleteOutline, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  authVerification();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

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
      const res = await axios.delete(`/api/products/${id}`);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      console.log(error);
    }
  };

  const currencyFormatter = (value) => {
    const formatter = new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
    });

    return formatter.format(value);
  };

  const totalValue = (product) => {
    let totalQuantity = 0;

    product.sizes.forEach((size) => {
      totalQuantity += size.quantity;
    });

    const value = totalQuantity * product.price;

    return currencyFormatter(value);
  };

  return (
    <>
      <Hamburger />

      <Box>
        <Link href="/products/add">Add Product</Link>

        <TableContainer className="product-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Value</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No products available.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
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
                    <TableCell align="center">{totalValue(product)}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          setTimeout(() => {
                            navigate(`${product._id}`);
                          }, 1000)
                        }
                      >
                        <Visibility />
                      </Button>
                      <Button
                        onClick={() =>
                          setTimeout(() => {
                            navigate(`/products/update/${product._id}`);
                          }, 1000)
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
      </Box>
    </>
  );
};

export default Products;
