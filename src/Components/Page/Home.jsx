// src/pages/Home.jsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Office Management System</h1>
      
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Manage Customers, Staff, Products, and Retail Income easily.  
        Please Login or Register to continue.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
