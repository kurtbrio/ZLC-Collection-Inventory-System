import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Link } from "@mui/material";
import { toast } from "react-hot-toast";
import authVerification from "../../custom-hooks/authVerification";
import Hamburger from "../../components/Sidebar/Hamburger";

const AddSale = () => {
  authVerification();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleSize, setSaleSize] = useState([]);
  const [isAllZero, setIsAllZero] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const currencyFormatter = (value) => {
    return new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

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
      console.log(selectedProduct);
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
        setSelectedProduct(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="full">
        <Hamburger />

        <Box className="container flex flex-col gap-5 ">
          <Link href="/sales">Go Back</Link>

          <div className="flex items-center gap-2">
            <label>Select Product:</label>

            <select
              value={selectedProduct?._id || ""}
              onChange={handleSelectedProduct}
              className="text-xs"
            >
              <option></option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2"
          >
            {selectedProduct && (
              <>
                <div className="w-full flex justify-center items-center">
                  <img
                    src={`http://localhost:4000/${selectedProduct.imageUrl}`}
                    className="w-96 h-96 object-cover rounded-2xl"
                  />
                </div>

                <div className="flex flex-col gap-3 p-5">
                  <div>
                    <h2 className="text-2xl">{selectedProduct.name}</h2>

                    <h3 className="text-lg">
                      {currencyFormatter(selectedProduct.price)}
                    </h3>
                  </div>
                  {saleSize.map((size, index) => (
                    <div key={index} className="flex items-center">
                      <label className="w-10">{size.size}: </label>
                      {selectedProduct.sizes[index].quantity === 0 ? (
                        <p className="ml-2 text-red-700">Out of Stock</p>
                      ) : (
                        <>
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
                              handleSizeChange(
                                index,
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : 0
                              )
                            }
                            min={0}
                            disabled
                          />
                          <Button
                            type="button"
                            onClick={() => handleIncrement(index)}
                            disabled={
                              size.quantity ==
                              selectedProduct.sizes[index].quantity
                            }
                          >
                            +
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 ">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAllZero}
                    className="btn-primary mt-5"
                  >
                    Submit Sale
                  </button>
                </div>
              </>
            )}
          </form>
        </Box>
      </div>
    </>
  );
};

export default AddSale;
