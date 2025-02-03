import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authVerification from "../../custom-hooks/authVerification";
import { produce } from "immer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateProduct = () => {
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

  const [newImageUrl, setNewImageUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`api/products/${id}`);
        setProduct(res.data.product);
        setNewImageUrl(null);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", parseFloat(product.price));
      formData.append("category", product.category);
      formData.append("type", product.type);
      formData.append("sizes", JSON.stringify(product.sizes));
      formData.append("gender", product.gender);

      if (newImageUrl) {
        formData.append("file", newImageUrl);
      }

      const res = await axios.patch(`api/products/${id}`, formData);

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/products");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProducts) => ({
      ...prevProducts,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, e) => {
    const { value } = e.target;

    setProduct((prevProduct) =>
      produce(prevProduct, (product) => {
        product.sizes[index].quantity = parseInt(value);
      })
    );
  };

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>&#8369;:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Category: </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              <option value="Kids">Kids</option>
              <option value="Adult">Adult</option>
            </select>
          </div>
          <div className="form-group">
            <label>Type: </label>
            <select name="type" value={product.type} onChange={handleChange}>
              <option value="Shirt">Shirt</option>
              <option value="Shorts">Shorts</option>
              <option value="Pants">Pants</option>
              <option value="Dress">Dress</option>
              <option value="Jacket">Jacket</option>
              <option value="Set">Set</option>
            </select>
          </div>
          <div className="form-group">
            {product.sizes.map((size, index) => (
              <div key={index} className="size-group">
                <label>{size.size}</label>
                <input
                  name="quantity"
                  type="number"
                  value={size.quantity}
                  onChange={(e) => handleSizeChange(index, e)}
                />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Gender: </label>
            <select value={product.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div
            className="form-group"
            style={{ width: "200px", height: "200px" }}
          >
            <img
              src={`http://localhost:4000/${product.imageUrl}`}
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="form-group">
            <label>Upload Image: </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImageUrl(e.target.files[0])}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </Box>
    </>
  );
};

export default UpdateProduct;
