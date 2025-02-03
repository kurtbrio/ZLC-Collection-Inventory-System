import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authVerification from "../../custom-hooks/authVerification";
import Hamburger from "../../components/Sidebar/Hamburger";
import { toast } from "react-hot-toast";
import { produce } from "immer";

const AddProduct = () => {
  authVerification();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [sizes, setSizes] = useState([
    { size: "S", quantity: 0 },
    { size: "M", quantity: 0 },
    { size: "L", quantity: 0 },
    { size: "XL", quantity: 0 },
    { size: "XXL", quantity: 0 },
  ]);
  const [gender, setGender] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", imageUrl);
      formData.append("name", name);
      formData.append("price", parseFloat(price));
      formData.append("category", category);
      formData.append("type", type);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("gender", gender);

      const res = await axios.post("/api/products", formData);

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.success);
        setTimeout(() => {
          navigate("/products");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <>
      <Hamburger />

      <div className="form-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={category}
              name="category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Kids">Kids</option>
              <option value="Adult">Adult</option>
            </select>
          </div>
          <div className="form-group">
            <label>Type: </label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Shirt">Shirt</option>
              <option value="Shorts">Shorts</option>
              <option value="Pants">Pants</option>
              <option value="Dress">Dress</option>
              <option value="Jacket">Jacket</option>
              <option value="Set">Set</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sizes</label>
            {sizes.map((size, index) => (
              <div className="size-group" key={index}>
                <label>{size.size}:</label>
                <input
                  type="number"
                  name={`size-${index}`}
                  value={size.quantity}
                  onChange={(e) => {
                    setSizes((currentSizes) =>
                      produce(currentSizes, (size) => {
                        size[index].quantity = parseInt(e.target.value);
                      })
                    );
                  }}
                />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageUrl(e.target.files[0])}
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
