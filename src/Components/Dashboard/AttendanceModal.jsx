import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceModal = ({
  onClose,
  onSave,
  attendanceDate,
  setAttendanceDate,
  attendanceStatus,
  setAttendanceStatus,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

        <label className="block mb-2 text-gray-700">Date:</label>
        <DatePicker
          selected={attendanceDate}
          onChange={(date) => setAttendanceDate(date)}
          dateFormat="dd/MM/yyyy"
          className="border p-2 rounded-lg w-full mb-4"
        />

        <label className="block mb-2 text-gray-700">Status:</label>
        <select
          value={attendanceStatus}
          onChange={(e) => setAttendanceStatus(e.target.value)}
          className="border p-2 rounded-lg w-full mb-6"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

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

export default AttendanceModal;
