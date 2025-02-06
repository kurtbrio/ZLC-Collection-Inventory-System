import React, { useEffect, useState } from "react";
import authVerification from "../../custom-hooks/authVerification";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Hamburger from "../../components/Sidebar/Hamburger";
import { Button } from "@mui/material";

const ViewProduct = () => {
  authVerification();

  const navigate = useNavigate();
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
      <div id="full">
        <Hamburger />

        <div id="container">
          <h1>{product.name}</h1>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
