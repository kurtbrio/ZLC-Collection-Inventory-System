import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Hamburger from "../../components/Sidebar/Hamburger";
import { Link } from "@mui/material";

const ViewSale = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sale, setSale] = useState({});

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get(`/api/sales/${id}`);

        setSale(res.data.sale);
        console.log(sale);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSale();
  }, [id]);

  if (!sale) {
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
          <Link href="/sales">Go Back</Link>

          <button
            className=""
            onClick={() => navigate(`product/${sale.product}`)}
          >
            {sale.productName}
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewSale;
