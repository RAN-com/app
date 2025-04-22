import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/Firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StaffAttendanceManager = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffGender, setNewStaffGender] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const staffPerPage = 5;

  // Fetch staff from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'staff'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStaff(data);
      setFilteredStaff(data);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const filterStaff = (query) => {
    if (!query) {
      setFilteredStaff(staff);
    } else {
      const filtered = staff.filter((staffMember) =>
        staffMember.name.toLowerCase().includes(query.toLowerCase()) ||
        staffMember.gender.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterStaff(e.target.value);
  };

  const filterByAttendance = (filteredStaff) => {
    if (attendanceFilter === 'All') return filteredStaff;

    // Get today's date formatted as 'YYYY-MM-DD'
    const todayDateString = new Date().toISOString().split('T')[0];

    return filteredStaff.filter(staffMember => {
      const todayAttendance = staffMember.attendance?.find(att =>
        att.date === todayDateString // Compare only the date part, ignoring the time
      );
      return todayAttendance?.status === attendanceFilter;
    });
  };

  const handleAttendanceFilterChange = (e) => {
    setAttendanceFilter(e.target.value);
  };

  const addStaff = async () => {
    if (!newStaffName || !newStaffGender) {
      alert('Fill all fields');
      return;
    }
    try {
      await addDoc(collection(db, 'staff'), {
        name: newStaffName,
        gender: newStaffGender,
        attendance: [],
        createdAt: new Date(),
      });
      setNewStaffName('');
      setNewStaffGender('');
      setShowAddStaff(false);
    } catch (error) {
      alert('Error adding staff: ' + error.message);
    }
  };

  const editStaff = async () => {
    if (!newStaffName || !newStaffGender) {
      alert('Fill all fields');
      return;
    }
    try {
      const staffRef = doc(db, 'staff', selectedStaff.id);
      await updateDoc(staffRef, {
        name: newStaffName,
        gender: newStaffGender,
      });
      setSelectedStaff(null);
      setNewStaffName('');
      setNewStaffGender('');
      setShowEditStaff(false);
    } catch (error) {
      alert('Error editing staff: ' + error.message);
    }
  };

  const deleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'staff', staffId));
      } catch (error) {
        alert('Error deleting staff: ' + error.message);
      }
    }
  };

  const addAttendance = async (staffId) => {
    const staffRef = doc(db, 'staff', staffId);
    const staffMember = staff.find((staffMember) => staffMember.id === staffId);
    if (!staffMember) return;

    const attendanceDateString = attendanceDate.toISOString().split('T')[0];
    const attendanceTimeString = attendanceDate.toLocaleTimeString();

    const existingAttendance = staffMember.attendance?.find(
      (att) => att.date.startsWith(attendanceDateString)
    );

    if (existingAttendance) {
      alert('Attendance for today has already been recorded.');
      return;
    }

    const updatedAttendance = [
      ...(staffMember.attendance || []),
      { date: attendanceDateString, time: attendanceTimeString, status: attendanceStatus },
    ];

    try {
      await updateDoc(staffRef, { attendance: updatedAttendance });
      setSelectedStaff(null);
      setAttendanceModalOpen(false);
    } catch (error) {
      alert('Error adding attendance: ' + error.message);
    }
  };

  const isAttendanceAlreadyRecorded = (staffMember) => {
    if (!staffMember.attendance) return false;
    const attendanceDateString = new Date().toISOString().split('T')[0];
    return staffMember.attendance.some((att) => att.date.startsWith(attendanceDateString));
  };

  const openAttendanceModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setAttendanceDate(new Date());
    setAttendanceStatus('Present');
    setAttendanceModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setAttendanceModalOpen(false);
    setSelectedStaff(null);
  };

  // Pagination logic
  const indexOfLastStaff = page * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filterByAttendance(filteredStaff).slice(
    indexOfFirstStaff,
    indexOfLastStaff
  );

  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  // Automatic attendance function
  const autoMarkAttendance = async () => {
    staff.forEach(async (staffMember) => {
      const staffRef = doc(db, 'staff', staffMember.id);
      const attendanceDateString = new Date().toISOString().split('T')[0];

      const existingAttendance = staffMember.attendance?.find(
        (att) => att.date.startsWith(attendanceDateString)
      );

      if (existingAttendance) {
        console.log(`Attendance already recorded for ${staffMember.name}`);
        return;
      }

      const updatedAttendance = [
        ...(staffMember.attendance || []),
        { date: attendanceDateString, status: 'Present', time: new Date().toLocaleTimeString() },
      ];

      try {
        await updateDoc(staffRef, { attendance: updatedAttendance });
        console.log(`Automatic attendance recorded for ${staffMember.name}`);
      } catch (error) {
        console.error('Error marking automatic attendance for ', staffMember.name, error.message);
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
  }, [staff]);

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
      <h1 className="text-3xl font-bold mb-6 text-center">Staff Attendance Manager</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name or gender"
        className="border p-2 rounded-lg mb-4 w-full"
      />

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAddStaff(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Staff
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
        <h2 className="text-2xl font-semibold mb-4">Staff List ({getFormattedDate()})</h2>
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
            {currentStaff.length > 0 ? (
              currentStaff.map((staffMember, index) => (
                <tr key={staffMember.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">{index + 1}</td>
                  <td className="py-3 px-6 border-b">{staffMember.name}</td>
                  <td className="py-3 px-6 border-b">{staffMember.gender}</td>
                  <td className="py-3 px-6 border-b max-h-48 overflow-y-auto">
                    {staffMember.attendance && staffMember.attendance.length > 0 ? (
                      <div className="space-y-2">
                        {staffMember.attendance.filter(att => att.date === new Date().toISOString().split('T')[0]).map((att, i) => (
                          <div key={i} className="bg-gray-100 p-2 rounded-md">
                            <div className="truncate">
                              {att.date} {att.time} - {att.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>No attendance recorded for today</div>
                    )}
                  </td>
                  <td className="py-3 px-6 border-b flex items-center">
                    {isAttendanceAlreadyRecorded(staffMember) ? (
                      <button
                        onClick={() => openAttendanceModal(staffMember)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        disabled
                      >
                         Attendance
                      </button>
                    ) : (
                      <button
                        onClick={() => openAttendanceModal(staffMember)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                       Attendance
                      </button>
                    )}
                    <button
                      onClick={() => deleteStaff(staffMember.id)}
                      className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No staff found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Previous
        </button>
        <span className="self-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Staff</h2>
            <input
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Staff Name"
              className="border p-2 rounded-lg mb-4 w-full"
            />
             <select
                value={newStaffGender}
                onChange={(e) => setNewStaffGender(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            <div className="flex justify-between">
              <button
                onClick={addStaff}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddStaff(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attendanceModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Mark Attendance for {selectedStaff?.name}</h2>
            <DatePicker
              selected={attendanceDate}
              onChange={(date) => setAttendanceDate(date)}
              dateFormat="yyyy/MM/dd"
              className="border p-2 rounded-lg mb-4 w-full"
            />
            <select
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
              className="border p-2 rounded-lg mb-4 w-full"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => addAttendance(selectedStaff.id)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={closeAttendanceModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendanceManager;
  