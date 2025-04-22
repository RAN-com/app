import React from 'react';

const CartSidebar = ({ cart, removeFromCart, updateQuantity }) => {
  const calculateTotalPrice = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="fixed top-0 right-0 bg-white w-80 h-full shadow-xl p-6 overflow-y-auto z-50">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <ul>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <li key={index} className="flex justify-between items-center mb-4">
              <div>
                <span>{item.name} - {item.flavor}</span>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => updateQuantity(index, 'decrease')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 'increase')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </ul>
      {cart.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${calculateTotalPrice(cart).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
