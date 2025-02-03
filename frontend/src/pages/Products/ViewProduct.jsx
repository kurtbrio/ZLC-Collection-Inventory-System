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
        const res = await axios.get(`api/products/${id}`);
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
      <Hamburger />

      <Button
        onClick={() => {
          navigate("/products");
        }}
      >
        Go Back..
      </Button>
      <div>{product.name}</div>
      <div>{product.price}</div>
      <div>{product.category}</div>
      <div>{product.type}</div>
      <div>
        {product.sizes.map((size) => (
          <div key={size._id}>
            {size.size}: {size.quantity}
          </div>
        ))}
      </div>
      <div>{product.gender}</div>
      <div>{product.date}</div>
      <div>
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
      </div>
    </>
  );
};

export default ViewProduct;
