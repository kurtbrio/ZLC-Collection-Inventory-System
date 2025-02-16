import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Hamburger from "../../components/Sidebar/Hamburger";
import { Link } from "@mui/material";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    type: "",
    sizes: [],
    gender: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

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

        <div className="container">
          <Link href="/products">Go back</Link>
          <h1>{product.name}</h1>
          <h1>{product.name}</h1>
          <h1>{product.name}</h1>
          <h1>{product.name}</h1>
          <h1>{product.name}</h1>
          <h1>{product.name}</h1>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
