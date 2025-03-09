import React, { useEffect, useState } from "react";
import axios from "axios";
import Hamburger from "../../components/Sidebar/Hamburger";
import { Link } from "@mui/material";
import SalesTable from "../../components/Table/SalesTable";

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("/api/sales");
        setSales(res.data.sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  const handleDeleteSale = (id) => {
    setSales((prevSales) => prevSales.filter((sale) => sale._id !== id));
  };

  return (
    <>
      <div className="full">
        <Hamburger />
        <div className="container">
          <Link href="sales/add">Add Sales</Link>

          <SalesTable sales={sales} deleteSale={handleDeleteSale} />
        </div>
      </div>
    </>
  );
};

export default Sales;
