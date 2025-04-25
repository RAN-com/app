import React from 'react';

const CustomerForm = ({
  onClose,
  onSave,
  name,
  setName,
  gender,
  setGender,
  phone,
  setPhone,
  referral,
  setReferral,
  days,
  setDays,
  subscriptionAmount,
  setSubscriptionAmount,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Customer Form</h2>

        {/* Customer Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 rounded-lg w-full mb-4"
        />

        {/* Gender Dropdown */}
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 rounded-lg w-full mb-4"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Phone Number Input */}
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="border p-2 rounded-lg w-full mb-4"
        />

        {/* Referral Input */}
        <input
          type="text"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          placeholder="Referral"
          className="border p-2 rounded-lg w-full mb-4"
        />

        {/* Present Days Input */}
       

        {/* Subscription Amount Input */}
        <input
          type="number"
          value={subscriptionAmount}
          onChange={(e) => setSubscriptionAmount(e.target.value)}
          placeholder="Subscription Amount"
          className="border p-2 rounded-lg w-full mb-4"
        />

        <div className="flex justify-between">
          <button
            onClick={onSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
