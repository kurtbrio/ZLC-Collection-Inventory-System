import React, { useState, useEffect } from "react";
import axios from "axios";

const MonthlyTopSellers = ({ date }) => {
  const [products, setProducts] = useState([]);

  const fetchSalesReport = async () => {
    try {
      const [year, month] = date.split("-");

      const response = await axios.post("/api/reports/top", {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
      });

      setProducts(response.data.topSellers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
    console.log(products);
  }, [date]);

  return (
    <div className="w-full h-full overflow-hidden overflow-y-scroll grid gap-5 text-center p-5">
      <h1>Top Products</h1>
      {products.map((product) => (
        <div className="grid grid-cols-2 gap-10 lg:gap-5 not-last:border-b-1 not-last:pb-5 ">
          <div>
            <img
              src={`http://localhost:4000/${product.imageUrl}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded-xl border-highlight border-1"
            />
          </div>
          <div className="flex flex-col justify-around ">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg overflow-hidden line-clamp-2 leading-5 text-ellipsis">
                {product.productName}
              </h2>
              <p className="text-xs">Quantity Sold: {product.quantitySold}</p>
            </div>

            <button className="btn-primary w-full">
              <a href="href={`products/${product.id._id}`}">Go to Product</a>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyTopSellers;
