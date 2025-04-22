import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/Firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceManager = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerGender, setNewCustomerGender] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const customersPerPage = 5;

  // Fetch customers from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCustomers(data);
      setFilteredCustomers(data);
    });

    return () => unsubscribe(); // Cleanup on unmount
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterCustomers(e.target.value);
  };

  const filterByAttendance = (filteredCustomers) => {
    if (attendanceFilter === 'All') return filteredCustomers;

    // Get today's date formatted as 'YYYY-MM-DD'
    const todayDateString = new Date().toISOString().split('T')[0];

    return filteredCustomers.filter(customer => {
      const todayAttendance = customer.attendance?.find(att =>
        att.date === todayDateString // Compare only the date part, ignoring the time
      );
      return todayAttendance?.status === attendanceFilter;
    });
  };

  const handleAttendanceFilterChange = (e) => {
    setAttendanceFilter(e.target.value);
  };

  const addCustomer = async () => {
    if (!newCustomerName || !newCustomerGender) {
      alert('Fill all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'customers'), {
        name: newCustomerName,
        gender: newCustomerGender,
        attendance: [],
        createdAt: new Date(),
      });
      setNewCustomerName('');
      setNewCustomerGender('');
      setShowAddCustomer(false);
    } catch (error) {
      alert('Error adding customer: ' + error.message);
    }
  };

  const editCustomer = async () => {
    if (!newCustomerName || !newCustomerGender) {
      alert('Fill all fields');
      return;
    }
    try {
      const customerRef = doc(db, 'customers', selectedCustomer.id);
      await updateDoc(customerRef, {
        name: newCustomerName,
        gender: newCustomerGender,
      });
      setSelectedCustomer(null);
      setNewCustomerName('');
      setNewCustomerGender('');
      setShowEditCustomer(false);
    } catch (error) {
      alert('Error editing customer: ' + error.message);
    }
  };

  const deleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteDoc(doc(db, 'customers', customerId));
      } catch (error) {
        alert('Error deleting customer: ' + error.message);
      }
    }
  };

  const addAttendance = async (customerId) => {
    const customerRef = doc(db, 'customers', customerId);
    const customer = customers.find((cust) => cust.id === customerId);
    if (!customer) return;

    const attendanceDateString = attendanceDate.toISOString().split('T')[0];
    const attendanceTimeString = attendanceDate.toLocaleTimeString();

    const existingAttendance = customer.attendance?.find(
      (att) => att.date.startsWith(attendanceDateString)
    );

    if (existingAttendance) {
      alert('Attendance for today has already been recorded.');
      return;
    }

    const updatedAttendance = [
      ...(customer.attendance || []),
      { date: attendanceDateString, time: attendanceTimeString, status: attendanceStatus },
    ];

    try {
      await updateDoc(customerRef, { attendance: updatedAttendance });
      setSelectedCustomer(null);
      setAttendanceModalOpen(false);
    } catch (error) {
      alert('Error adding attendance: ' + error.message);
    }
  };

  const isAttendanceAlreadyRecorded = (customer) => {
    if (!customer.attendance) return false;
    const attendanceDateString = new Date().toISOString().split('T')[0];
    return customer.attendance.some((att) => att.date.startsWith(attendanceDateString));
  };

  const openAttendanceModal = (customer) => {
    setSelectedCustomer(customer);
    setAttendanceDate(new Date());
    setAttendanceStatus('Present');
    setAttendanceModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setAttendanceModalOpen(false);
    setSelectedCustomer(null);
  };

  // Pagination logic
  const indexOfLastCustomer = page * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filterByAttendance(filteredCustomers).slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Automatic attendance function
  const autoMarkAttendance = async () => {
    customers.forEach(async (customer) => {
      const customerRef = doc(db, 'customers', customer.id);
      const attendanceDateString = new Date().toISOString().split('T')[0];

      const existingAttendance = customer.attendance?.find(
        (att) => att.date.startsWith(attendanceDateString)
      );

      if (existingAttendance) {
        console.log(`Attendance already recorded for ${customer.name}`);
        return;
      }

      const updatedAttendance = [
        ...(customer.attendance || []),
        { date: attendanceDateString, status: 'Present', time: new Date().toLocaleTimeString() },
      ];

      try {
        await updateDoc(customerRef, { attendance: updatedAttendance });
        console.log(`Automatic attendance recorded for ${customer.name}`);
      } catch (error) {
        console.error('Error marking automatic attendance for ', customer.name, error.message);
      }
    });
  };

  // Use useEffect or setInterval to trigger the function at a specific time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() === 0) {  // Check if it is 9:00 AM
        autoMarkAttendance(); // Call the function to automatically mark attendance
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, [customers]);

  // Function to format today's date
  const getFormattedDate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Attendance Manager</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name or gender"
        className="border p-2 rounded-lg mb-4 w-full"
      />

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAddCustomer(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Customer
        </button>
        <select
          value={attendanceFilter}
          onChange={handleAttendanceFilterChange}
          className="border p-2 rounded-lg"
        >
          <option value="All">All Attendance</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Customer List ({getFormattedDate()})</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border-b text-left">ID</th>
              <th className="py-3 px-6 border-b text-left">Name</th>
              <th className="py-3 px-6 border-b text-left">Gender</th>
              <th className="py-3 px-6 border-b text-left">Attendance Status</th>
              <th className="py-3 px-6 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">{index + 1}</td>
                  <td className="py-3 px-6 border-b">{customer.name}</td>
                  <td className="py-3 px-6 border-b">{customer.gender}</td>
                  <td className="py-3 px-6 border-b max-h-48 overflow-y-auto">
                    {customer.attendance && customer.attendance.length > 0 ? (
                      <div className="space-y-2">
                        {customer.attendance.filter(att => att.date === new Date().toISOString().split('T')[0]).map((att, i) => (
                          <div key={i} className="bg-gray-100 p-2 rounded-md">
                            <div className="truncate">
                              {att.date} {att.time} - {att.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      'No Attendance Recorded'
                    )}
                  </td>
                  <td className="py-5 border-b flex gap-2">
                    <button
                      onClick={() => openAttendanceModal(customer)}
                      disabled={isAttendanceAlreadyRecorded(customer)}
                      className={`bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 
                        ${isAttendanceAlreadyRecorded(customer) ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                    >
                      Attendance
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setNewCustomerName(customer.name);
                        setNewCustomerGender(customer.gender);
                        setShowEditCustomer(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        <div className="flex items-center">
          <span>Page {page} of {totalPages}</span>
        </div>
        <button
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Add New Customer</h2>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
              <select
                value={newCustomerGender}
                onChange={(e) => setNewCustomerGender(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowAddCustomer(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attendanceModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Mark Attendance</h2>
            <div className="mt-4">
              <DatePicker
                selected={attendanceDate}
                onChange={(date) => setAttendanceDate(date)}
                className="border p-2 w-full mb-4 rounded"
              />
              <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={closeAttendanceModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => addAttendance(selectedCustomer.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;
