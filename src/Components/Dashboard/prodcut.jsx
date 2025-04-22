import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ProductPage from '';
import AddProduct from './components/AddProduct';


const ProductManagement = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <div className="p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <nav>
            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
              Product List
            </Link>
            <Link to="/add-product" className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Add Product
            </Link>
          </nav>
        </div>

        <Switch>
          <Route exact path="/" render={() => <ProductPage addToCart={addToCart} />} />
          <Route path="/add-product" component={AddProduct} />
        </Switch>
      </div>
    </Router>
  );
};

export default ProductManagement;
