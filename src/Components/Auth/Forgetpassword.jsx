// src/components/Auth/ForgotPassword.jsx
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Components/Firebase/Firebase";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
          Send Reset Link
        </button>

        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
