// AdminLeaveRequests.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);
  
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('/api/leave-requests/');
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch leave requests');
      setLoading(false);
    }
  };
  
  const updateRequestStatus = async (requestId, status) => {
    try {
      await axios.put(`/api/leave-requests/${requestId}/`, { status });
      // Update local state to reflect the change
      setLeaveRequests(leaveRequests.map(req => 
        req.id === requestId ? { ...req, status } : req
      ));
    } catch (err) {
      setError(`Failed to update request: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="admin-leave-requests">
      <h2>Pending Leave Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map(request => (
            <tr key={request.id}>
              <td>{request.requester.username}</td>
              <td>{request.leave_type}</td>
              <td>{request.start_date}</td>
              <td>{request.end_date}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'PENDING' && (
                  <>
                    <button onClick={() => updateRequestStatus(request.id, 'APPROVED')}>
                      Approve
                    </button>
                    <button onClick={() => updateRequestStatus(request.id, 'REJECTED')}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminLeaveRequests;