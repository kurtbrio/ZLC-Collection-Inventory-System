import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Hamburger from "../../components/Sidebar/Hamburger";
import { Link } from "@mui/material";
import SalesTable from "../../components/Table/SalesTable";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productSales, setProductSales] = useState([]);

  useEffect(() => {
    const fetchProductSales = async () => {
      try {
        const res = await axios.get(`/api/sales/product/${id}`);
        setProductSales(res.data.sales);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
    fetchProductSales();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const currencyFormatter = (value) => {
    return new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const handleDeleteSale = (id) => {
    setProductSales((prevSales) => prevSales.filter((sale) => sale._id !== id));
    fetchProduct(id);
  };

  if (!product) {
    return (
      <>
        <Hamburger />
        <div>Product not found</div>
      </>
    );
  }

  return (
    <>
      <div className="full">
        <Hamburger />

        <div className="container flex flex-col gap-5">
          <Link href="/products">Go back</Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 ">
            <img
              src={`http://localhost:4000/${product.imageUrl}`}
              alt={product.name}
              className="m-auto rounded-xl h-96 w-[80%] object-cover"
            />
            <div className="flex flex-col">
              <div className="text-2xl">{product.name}</div>
              <div className="text-lg">
                {product.category} - {product.gender}
              </div>
              <div className="text-lg">{product.type}</div>
              <div className="text-2xl pt-2.5">
                {currencyFormatter(product.price)}
              </div>
              <ul className="pt-5">
                {product.sizes.map((size, index) => (
                  <li className="flex gap-2" key={index}>
                    {size.size}:
                    <p className={size.quantity === 0 ? "text-red-700" : ""}>
                      {size.quantity === 0 ? "Out of Stock" : size.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <SalesTable sales={productSales} deleteSale={handleDeleteSale} />
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
