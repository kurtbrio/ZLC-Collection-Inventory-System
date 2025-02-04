import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button } from "@mui/material";
import { toast } from "react-hot-toast";
import authVerification from "../../custom-hooks/authVerification";
import { useNavigate } from "react-router-dom";
import Hamburger from "../../components/Sidebar/Hamburger";

const AddSale = () => {
  authVerification();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleSize, setSaleSize] = useState([]);
  const [isAllZero, setIsAllZero] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data.products);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const allZero = saleSize.every((size) => size.quantity === 0);
    setIsAllZero(allZero);
  }, [saleSize]);

  const handleSelectedProduct = async (e) => {
    try {
      const productId = e.target.value;
      const res = await axios.get(`/api/products/${productId}`);
      const sizesToZero = res.data.product.sizes.map((size) => ({
        ...size,
        quantity: 0,
      }));

      setSaleSize(sizesToZero);
      setSelectedProduct(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSizeChange = (index, newQuantity) => {
    const updatedSizes = saleSize.map((size, i) => {
      if (i === index) {
        return { ...size, quantity: newQuantity };
      }
      return size;
    });

    setSaleSize(updatedSizes);
  };

  const handleIncrement = (index) => {
    const currentQuantity = saleSize[index].quantity;
    handleSizeChange(index, currentQuantity + 1);
  };

  const handleDecrement = (index) => {
    const currentQuantity = saleSize[index].quantity;
    handleSizeChange(index, Math.max(0, currentQuantity - 1));
  };

  const calculateTotal = () => {
    let total = 0;

    saleSize.forEach((size) => {
      total += size.quantity;
    });

    return total * selectedProduct.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalPrice = calculateTotal();

      const saleData = {
        productId: selectedProduct._id,
        sizes: saleSize,
        totalPrice,
        date,
      };

      const res = await axios.post("/api/sales", saleData);

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.success);
        setTimeout(() => {
          navigate("/sales");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div id="full">
        <Hamburger />

        <Box id="container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Product:</label>

              <select
                value={selectedProduct?._id || ""}
                onChange={handleSelectedProduct}
              >
                <option value="" disabled>
                  Select a product
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                <div className="product-info">
                  <div className="product-img">
                    <img
                      src={`http://localhost:4000/${selectedProduct.imageUrl}`}
                      style={{ width: "200px", height: "200px" }}
                    />
                  </div>
                  <h1>{selectedProduct.name}</h1>
                </div>

                <div className="form-group">
                  <label>Sizes stock</label>

                  {saleSize.map((size, index) => (
                    <div key={index} className="size-group">
                      <label>{size.size}: </label>
                      <Button
                        type="button"
                        onClick={() => handleDecrement(index)}
                        disabled={size.quantity <= 0}
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        value={size.quantity}
                        onChange={(e) =>
                          handleSizeChange(index, parseInt(e.target.value) || 0)
                        }
                        min={0}
                        disabled
                        style={{ width: "20px", textAlign: "center" }}
                      />
                      <Button
                        type="button"
                        onClick={() => handleIncrement(index)}
                        disabled={
                          size.quantity == selectedProduct.sizes[index].quantity
                        }
                      >
                        +
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={isAllZero}>
                  Submit Sale
                </button>
              </>
            )}
          </form>
        </Box>
      </div>
    </>
  );
};

export default AddSale;
