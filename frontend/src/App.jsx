import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import AddProduct from "./pages/Products/AddProduct";
import ViewProduct from "./pages/Products/ViewProduct";
import UpdateProduct from "./pages/Products/UpdateProduct";
import Sales from "./pages/Sales/Sales";
import AddSale from "./pages/Sales/AddSale";
import ViewSale from "./pages/Sales/ViewSale";
import Reports from "./pages/Reports/Reports";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

function App() {
  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <div className="bg-main-bg h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id" element={<ViewProduct />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/add" element={<AddSale />} />
          <Route path="/sales/:id" element={<ViewSale />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
