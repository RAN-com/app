// src/components/Dashboard/Sidebar.jsx
import { Link } from "react-router-dom";
import { Users, Box, DollarSign, Calendar, CheckSquare,  } from "lucide-react";

function Sidebar() {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col p-6 shadow-lg
                    md:w-64 w-20 transition-all duration-300 overflow-hidden">
      <h1 className="text-3xl font-bold mb-10 text-yellow-400 md:block hidden">Dashboard</h1>
      <nav className="flex flex-col gap-4">
        <SidebarLink to="/dashboard/customer-management" label="Customer Management" Icon={Users} />
        <SidebarLink to="/dashboard/staff-management" label="Staff Management" Icon={Users} />
        <SidebarLink to="/dashboard/product-management" label="Product Management" Icon={Box} />
        <SidebarLink to="/dashboard/retail-income" label="Retail Income" Icon={DollarSign} />
        {/* Add the Admin Page link */}
        <SidebarLink to="/dashboard/admin" label="Admin Page"  />
      </nav>
    </div>
  );
}

function SidebarLink({ to, label, Icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-all"
    >
      {Icon && <Icon size={24} />}
      <span className="text-lg md:inline hidden">{label}</span>
    </Link>
  );
}

export default Sidebar;
