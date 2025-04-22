// src/components/ProductList.js
import React from 'react';

const ProductList = ({ products, addToCart }) => {
  return (
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
                  disabled={product.count <= 0}
                >
                  {product.count > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
