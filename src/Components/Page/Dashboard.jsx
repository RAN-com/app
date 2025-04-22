// src/pages/Dashboard.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";
import CustomerManagement from "../Dashboard/CustomerManagement";
import StaffManagement from "../Dashboard/StaffManagement";
import ProductManagement from "../Dashboard/ProductOutput";
import RetailIncome from "../Dashboard/RetailIncome";
import AdminPage from "../Adminpanel/Adminpage";

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8">
        <Routes>
          <Route path="/customer-management" element={<CustomerManagement />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/retail-income" element={<RetailIncome />} />
          <Route path="/admin" element={<AdminPage />} />
        
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
