import React, { useEffect, useState } from "react";
import Hamburger from "../../components/Sidebar/Hamburger";
import DailySaleComparison from "../Reports/Daily/DailySaleComparison";
import MonthlySaleComparison from "../Reports/Monthly/MonthlySaleComparison";
import YearlySaleComparison from "../Reports/Yearly/YearlySaleComparison";
import LineChartYearlyReport from "../Reports/Yearly/LineChartYearlyReport";
import YearlyTopSellers from "../Reports/Yearly/YearlyTopSellers";
import YearlySaleByType from "../Reports/Yearly/YearlySaleByType";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faCartShopping,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [date, setDate] = useState(() => new Date());
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("/api/products");

      setProducts(response.data.products);
    };

    const fetchSales = async () => {
      const response = await axios.get("/api/sales");

      console.log(response.data.sales);
      setSales(response.data.sales);
    };

    fetchProducts();
    fetchSales();
  }, []);

  const getSalesQuantity = (sales) => {
    return sales.reduce((acc, sale) => {
      sale.sizes.forEach((size) => {
        acc += size.quantity;
      });
      return acc;
    }, 0);
  };

  const getTotalSales = (sales) => {
    return sales.reduce((acc, sale) => {
      return (acc += sale.totalPrice);
    }, 0);
  };

  return (
    <>
      <div className="full">
        <Hamburger />
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:row-span-5 lg:row-span-3 gap-5">
            <div className="grid-item flex gap-5 h-30">
              <FontAwesomeIcon
                icon={faBoxArchive}
                className="text-5xl text-highlight"
              />
              <div className="text-center">
                <h1>Total Products</h1>
                <h2 className="text-highlight text-5xl">
                  {products.length > 0 ? products.length : 0}
                </h2>
              </div>
            </div>

            <div className="grid-item flex gap-5 h-30">
              <FontAwesomeIcon
                icon={faSackDollar}
                className="text-5xl text-highlight"
              />
              <div className="text-center">
                <h1>Total Sales</h1>
                <h2 className="text-highlight text-5xl">
                  &#8369;{getTotalSales(sales)}
                </h2>
              </div>
            </div>

            <div className="grid-item flex gap-5 h-30">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-5xl text-highlight"
              />
              <div className="text-center">
                <h1>Quantity Sold</h1>
                <h2 className="text-highlight text-5xl">
                  {getSalesQuantity(sales)}
                </h2>
              </div>
            </div>

            <div className="grid-item lg:row-span-2 h-[500px]">
              <YearlyTopSellers date={date.getFullYear()} />
            </div>

            <div className="grid-item">
              <DailySaleComparison date={date.toISOString().slice(0, 10)} />
            </div>

            <div className="grid-item">
              <MonthlySaleComparison date={date.toISOString().slice(0, 7)} />
            </div>

            <div className="grid-item">
              <YearlySaleComparison date={date.getFullYear()} />
            </div>

            <div className="grid-item md:col-span-2 lg:col-span-3">
              <LineChartYearlyReport date={date.getFullYear()} />
            </div>

            <div className="grid-item">
              <YearlySaleByType date={date.getFullYear()} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

{
  /* <div className="col-span-4 grid grid-cols-4 gap-5">
            

            

            

          <div className="col-span-4 grid grid-cols-4 grid-rows-2 max-h-[600px] gap-5">
            
            
            
            
            
          </div> */
}
