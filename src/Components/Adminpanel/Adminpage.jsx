import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/Firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedGender, setUpdatedGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomers(data);
      setFilteredCustomers(data);
    });

    return () => unsubscribe();
  }, []);

  const filterCustomers = (query) => {
    if (!query) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.gender.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setUpdatedName(customer.name);
    setUpdatedGender(customer.gender);
  };

  const handleSaveEdit = async () => {
    if (!updatedName || !updatedGender) {
      alert('Please fill in both fields');
      return;
    }

    const customerRef = doc(db, 'customers', editingCustomer.id);
    try {
      await updateDoc(customerRef, {
        name: updatedName,
        gender: updatedGender,
      });
      setEditingCustomer(null);
      setUpdatedName('');
      setUpdatedGender('');
    } catch (error) {
      alert('Error updating customer: ' + error.message);
    }
  };

  const handleDelete = async (customerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
    if (confirmDelete) {
      const customerRef = doc(db, 'customers', customerId);
      try {
        await deleteDoc(customerRef);
      } catch (error) {
        alert('Error deleting customer: ' + error.message);
      }
    }
  };

  const paginateData = () => {
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    return filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin - Full Attendance History</h1>

      <input
        type="text"
        onChange={(e) => filterCustomers(e.target.value)}
        placeholder="Search by name or gender"
        className="border p-2 rounded-lg mb-4 w-full"
      />

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">All Attendance Records</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border-b text-left">ID</th>
              <th className="py-3 px-6 border-b text-left">Name</th>
              <th className="py-3 px-6 border-b text-left">Gender</th>
              <th className="py-3 px-6 border-b text-left">Attendance</th>
              <th className="py-3 px-6 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginateData().length > 0 ? (
              paginateData().map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">{index + 1}</td>
                  <td className="py-3 px-6 border-b">{customer.name}</td>
                  <td className="py-3 px-6 border-b">{customer.gender}</td>
                  <td className="py-3 px-6 border-b">
                    <button
                      onClick={() => setSelectedAttendance(customer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View Attendance
                    </button>
                  </td>
                  <td className="py-3 px-6 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
          >
            Prev
          </button>
          <span className="flex items-center">{currentPage} of {totalPages}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {/* Attendance Slide-in Side Panel */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 z-50 overflow-y-auto transform transition-transform duration-300 ${
          selectedAttendance ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedAttendance && (
          <>
            <h2 className="text-xl font-bold mb-4">{selectedAttendance.name}'s Attendance</h2>
            {selectedAttendance.attendance && selectedAttendance.attendance.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Time</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAttendance.attendance.map((att, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{att.date}</td>
                      <td className="p-2">{att.time}</td>
                      <td className="p-2">{att.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance records available.</p>
            )}
            <button
              onClick={() => setSelectedAttendance(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </>
        )}
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Gender</label>
              <input
                type="text"
                value={updatedGender}
                onChange={(e) => setUpdatedGender(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingCustomer(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
