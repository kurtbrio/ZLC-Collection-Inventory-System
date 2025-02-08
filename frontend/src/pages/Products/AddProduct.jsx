import axios from "axios";
import React, { useState } from "react";
import Hamburger from "../../components/Sidebar/Hamburger";
import { toast } from "react-hot-toast";
import { produce } from "immer";
import { Link } from "@mui/material";

const AddProduct = () => {
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
        setName("");
        setPrice("");
        setCategory("");
        setType("");
        setSizes([
          { size: "S", quantity: 0 },
          { size: "M", quantity: 0 },
          { size: "L", quantity: 0 },
          { size: "XL", quantity: 0 },
          { size: "XXL", quantity: 0 },
        ]);
        setGender("");
        setImageUrl(null);
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <>
      <div className="full">
        <Hamburger />

        <div className="container flex flex-col gap-5">
          <Link href="/products">Go back</Link>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={name}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Price (&#8369;):</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
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
              <div className="flex flex-col gap-1">
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
              <div className="flex flex-col gap-1">
                <label>Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label>Sizes</label>
              {sizes.map((size, index) => (
                <div className="flex items-center" key={index}>
                  <label className="w-10">{size.size}:</label>
                  <input
                    type="number"
                    name={`size-${index}`}
                    value={size.quantity}
                    onChange={(e) => {
                      setSizes((currentSizes) =>
                        produce(currentSizes, (size) => {
                          size[index].quantity = parseInt(e.target.value) || 0;
                        })
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <label>Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageUrl(e.target.files[0])}
              />
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full" type="submit">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
