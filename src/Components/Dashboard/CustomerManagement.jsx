import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/Firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import CustomerForm from './CustomerForm';

const AttendanceManager = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerGender, setNewCustomerGender] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerReferral, setNewCustomerReferral] = useState('');
  const [newCustomerDays, setNewCustomerDays] = useState('');

  // New state for subscription and payment information
  const [newSubscriptionAmount, setNewSubscriptionAmount] = useState('');
  const [newSalesAmount, setNewSalesAmount] = useState('');
  const [newBalanceAmount, setNewBalanceAmount] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const querySnapshot = await getDocs(collection(db, 'customers'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCustomers(data);
  };

  const addCustomer = async () => {
    await addDoc(collection(db, 'customers'), {
      name: newCustomerName,
      gender: newCustomerGender,
      phone: newCustomerPhone,
      referral: newCustomerReferral,
      days: newCustomerDays,
      subscriptionAmount: newSubscriptionAmount,
      salesAmount: newSalesAmount,
      balanceAmount: calculateBalanceAmount(newSubscriptionAmount, newSalesAmount),
      attendance: [],
      createdAt: new Date(),
    });
    resetForm();
    setShowAddCustomer(false);
    fetchCustomers();
  };

  const editCustomer = async () => {
    if (!editCustomerId) return;

    const customerRef = doc(db, 'customers', editCustomerId);
    await updateDoc(customerRef, {
      name: newCustomerName,
      gender: newCustomerGender,
      phone: newCustomerPhone,
      referral: newCustomerReferral,
      days: newCustomerDays,
      subscriptionAmount: newSubscriptionAmount,
      salesAmount: newSalesAmount,
      balanceAmount: calculateBalanceAmount(newSubscriptionAmount, newSalesAmount),
    });
    resetForm();
    setEditCustomerId(null);
    setShowAddCustomer(false);
    fetchCustomers();
  };

  const deleteCustomer = async (id) => {
    await deleteDoc(doc(db, 'customers', id));
    fetchCustomers();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Track Present days and assign an amount of 261 per day
  const markAttendance = async (customerId, status) => {
    const currentDate = formatDate(selectedDate);
    const currentTime = new Date().toLocaleTimeString();
    const customerRef = doc(db, 'customers', customerId);
    const customer = customers.find(c => c.id === customerId);

    // Check if attendance for the current date already exists
    const attendanceExists = (customer.attendance || []).some(
      (a) => a.date === currentDate
    );

    if (attendanceExists) {
      alert('Attendance already marked for today.');
      return; // Prevent attendance from being marked again.
    }

    // If attendance does not exist, proceed to mark it
    let updatedAttendance = [
      ...(customer.attendance || []).filter(a => a.date !== currentDate),
      { date: currentDate, status, time: currentTime },
    ];

    let presentDays = updatedAttendance.filter(a => a.status === 'Present').length;
    let presentAmount = presentDays * 261; // Each Present day is worth 261

    await updateDoc(customerRef, { 
      attendance: updatedAttendance,
      presentAmount: presentAmount, // Update the present amount in the customer record
      balanceAmount: calculateBalanceAmount(customer.subscriptionAmount, customer.salesAmount, presentDays) // Deduct 261 per present day
    });
    fetchCustomers();
  };

  const getAttendanceStatus = (customer, date) => {
    const record = (customer.attendance || []).find(a => a.date === date);
    return record ? `${record.status} at ${record.time}` : 'Not marked';
  };

  const getPresentDaysCount = (attendance) => {
    return (attendance || []).filter(a => a.status === 'Present').length;
  };

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const resetForm = () => {
    setNewCustomerName('');
    setNewCustomerGender('');
    setNewCustomerPhone('');
    setNewCustomerReferral('');
    setNewCustomerDays('');
    setNewSubscriptionAmount('');
    setNewSalesAmount('');
    setNewBalanceAmount('');
  };

  const openEditForm = (customer) => {
    setEditCustomerId(customer.id);
    setNewCustomerName(customer.name);
    setNewCustomerGender(customer.gender);
    setNewCustomerPhone(customer.phone);
    setNewCustomerReferral(customer.referral);
    setNewCustomerDays(customer.days);
    setNewSubscriptionAmount(customer.subscriptionAmount || '');
    setNewSalesAmount(customer.salesAmount || '');
    setNewBalanceAmount(customer.balanceAmount || '');
    setShowAddCustomer(true);
  };

  // Calculate balance amount as subscriptionAmount - salesAmount minus 261 per present day
  const calculateBalanceAmount = (subscriptionAmount, salesAmount, presentDays = 0) => {
    const subscription = parseFloat(subscriptionAmount) || 0;
    const sales = parseFloat(salesAmount) || 0;
    const presentAmountDeduction = presentDays * 261; // Deduct 261 for each present day

    return subscription - sales - presentAmountDeduction;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attendance - {formatDate(selectedDate)}</h1>
        <div className="flex gap-4">
          <button
            onClick={() => changeDate(-1)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Prev
          </button>
          <button
            onClick={() => changeDate(1)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Next
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddCustomer(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer
          </button>
          <button
            onClick={() => window.print()}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Print / Download
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border">#</th>
              <th className="py-3 px-6 border">Name</th>
              <th className="py-3 px-6 border">Gender</th>
              <th className="py-3 px-6 border">Phone</th>
              <th className="py-3 px-6 border">Referral</th>
              <th className="py-3 px-6 border">Present Days</th>
              <th className="py-3 px-6 border">Subscription Amount</th>
              <th className="py-3 px-6 border">Balance Amount</th>
              <th className="py-3 px-6 border">Sale Amount</th>
              <th className="py-3 px-6 border">Attendance</th>
              <th className="py-3 px-6 border print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id} className="text-center">
                <td className="py-3 px-6 border">{index + 1}</td>
                <td className="py-3 px-6 border">{customer.name}</td>
                <td className="py-3 px-6 border">{customer.gender}</td>
                <td className="py-3 px-6 border">{customer.phone}</td>
                <td className="py-3 px-6 border">{customer.referral}</td>
                <td className="py-3 px-6 border">{getPresentDaysCount(customer.attendance)}</td>
                <td className="py-3 px-6 border">{customer.subscriptionAmount || 'N/A'}</td>
            
                <td className="py-3 px-6 border">{customer.balanceAmount || 'N/A'}</td>
                <td className="py-3 px-6 border">{customer.presentAmount || 0}</td>
                <td className="py-3 px-6 border">
                  {getAttendanceStatus(customer, formatDate(selectedDate))}
                </td>
                <td className="py-3 px-6 border print:hidden">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => markAttendance(customer.id, 'Present')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(customer.id, 'Absent')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Absent
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEditForm(customer)}
                        className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddCustomer && (
        <CustomerForm
          onClose={() => {
            setShowAddCustomer(false);
            resetForm();
          }}
          onSave={editCustomerId ? editCustomer : addCustomer}
          name={newCustomerName}
          setName={setNewCustomerName}
          gender={newCustomerGender}
          setGender={setNewCustomerGender}
          phone={newCustomerPhone}
          setPhone={setNewCustomerPhone}
          referral={newCustomerReferral}
          setReferral={setNewCustomerReferral}
          days={newCustomerDays}
          setDays={setNewCustomerDays}
          subscriptionAmount={newSubscriptionAmount}
          setSubscriptionAmount={setNewSubscriptionAmount}
          salesAmount={newSalesAmount}
          setSalesAmount={setNewSalesAmount}
          balanceAmount={newBalanceAmount}
          setBalanceAmount={setNewBalanceAmount}
        />
      )}
    </div>
  );
};

export default AttendanceManager;
