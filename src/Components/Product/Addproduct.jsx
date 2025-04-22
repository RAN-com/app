import React, { useState } from 'react';
import { db, collection, addDoc } from '../Firebase/Firebase';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [flavor, setFlavor] = useState('');
  
  const handleAddProduct = async () => {
    if (!name || !flavor) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        name,
        flavor,
        stock: 100, // Unlimited stock, but we initialize with a default number
        createdAt: new Date(),
      });
      setName('');
      setFlavor('');
      alert('Product added successfully!');
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <input 
        type="text" 
        placeholder="Product Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="border p-2 rounded-lg w-full mb-4"
      />
      <input 
        type="text" 
        placeholder="Product Flavor" 
        value={flavor} 
        onChange={(e) => setFlavor(e.target.value)} 
        className="border p-2 rounded-lg w-full mb-4"
      />
      <button
        onClick={handleAddProduct}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
