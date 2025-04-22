import React, { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../Firebase/Firebase';
import CartSidebar from './CartSidebar';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Inventory</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          {sidebarOpen ? 'Close Cart' : 'Open Cart'}
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Flavor</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{product.name}</td>
                <td className="py-3 px-6">{product.flavor}</td>
                <td className="py-3 px-6">₹{product.price}</td>
                <td className="py-3 px-6">{product.count}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Sidebar */}
      {sidebarOpen && <CartSidebar cart={cart} removeFromCart={removeFromCart} />}
    </div>
  );
};

export default ProductPage;
