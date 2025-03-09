import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const YearlyTopSellers = ({ date }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSalesReport = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/reports/top", {
        year: parseInt(date, 10),
      });

      setProducts(response.data.topSellers);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [date]);

  return (
    <div className="text-center flex flex-col p-2 gap-4 w-full h-full overflow-hidden overflow-y-scroll">
      <div className="text-xl">
        {date} <p>Top Selling Products</p>
      </div>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <>
          {products.map((product, index) => (
            <div
              className="flex flex-col gap-5 not-last:border-b-1 not-last:pb-5"
              key={index}
            >
              <div>
                <img
                  src={`http://localhost:4000/${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-xl border-highlight border-1"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg overflow-hidden line-clamp-1 leading-5 text-ellipsis">
                    {product.productName}
                  </h2>
                  <p className="text-xs">
                    Quantity Sold:{" "}
                    <span className="text-sm font-bold">
                      {product.quantitySold}
                    </span>
                  </p>
                </div>

                <button className="btn-primary w-full mt-5 hover:!text-highlight hover:!border-highlight">
                  <a href={`products/${product.id._id}`}>Go to Product</a>
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default YearlyTopSellers;
