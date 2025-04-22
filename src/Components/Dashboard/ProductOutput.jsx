import React, { useState } from 'react';
import AddProduct from '../Product/AddProduct';
import ProductList from '../Product/ProductList';
import CartSidebar from '../Product/CartSidebar';

const ProductManagement = () => {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('addProduct');

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
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('addProduct')}
          className={`px-4 py-2 rounded-lg transition duration-200 ${
            activeTab === 'addProduct'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab('productList')}
          className={`px-4 py-2 rounded-lg transition duration-200 ${
            activeTab === 'productList'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Product List
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`px-4 py-2 rounded-lg transition duration-200 ${
            activeTab === 'cart'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Cart
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'addProduct' && <AddProduct />}
        {activeTab === 'productList' && <ProductList addToCart={addToCart} />}
        {activeTab === 'cart' && <CartSidebar cart={cart} removeFromCart={removeFromCart} />}
      </div>
    </div>
  );
};

export default ProductManagement;
