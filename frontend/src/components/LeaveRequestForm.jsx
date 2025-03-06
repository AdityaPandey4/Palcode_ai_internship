// components/LeaveRequestForm.jsx
// For Docker environment
// const API_BASE = "http://backend:8000/api"; 
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import React, { useState } from 'react';
import axios from 'axios';

function LeaveRequestForm({ userId }) {
  const [leaveText, setLeaveText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // First, extract information using AI
      const extractResponse = await axios.post(
        `${API_BASE}/api/extract-leave-info/`,
        { text: leaveText }
      );
      const extractedData = extractResponse.data;
      setExtractedInfo(extractedData);
      setSubmitEnabled(true);
      setMessage('Information extracted. Please review and confirm submission.');
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const confirmSubmission = async () => {
    setLoading(true);
    try {
      // Submit the leave request to the database
      const response = await axios.post('/api/leave-requests/', {
        user_id: userId,
        leave_type: extractedInfo.leave_type,
        start_date: extractedInfo.start_date,
        end_date: extractedInfo.end_date,
        reason: extractedInfo.reason
      });
      
      setMessage('Leave request submitted successfully!');
      setLeaveText('');
      setExtractedInfo(null);
      setSubmitEnabled(false);
    } catch (error) {
      setMessage(`Submission error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-request-form">
      <h2>Submit Leave Request</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Describe your leave request:
            <textarea 
              value={leaveText} 
              onChange={(e) => setLeaveText(e.target.value)}
              placeholder="Example: I need sick leave from tomorrow due to a medical treatment, from 11.11.25 to 12.12.25."
              rows={4}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Extract Information'}
        </button>
      </form>
      
      {extractedInfo && (
        <div className="extracted-info">
          <h3>Extracted Information:</h3>
          <p><strong>Leave Type:</strong> {extractedInfo.leave_type}</p>
          <p><strong>Start Date:</strong> {extractedInfo.start_date}</p>
          <p><strong>End Date:</strong> {extractedInfo.end_date}</p>
          <p><strong>Reason:</strong> {extractedInfo.reason}</p>
          
          <button 
            onClick={confirmSubmission} 
            disabled={!submitEnabled || loading}
            className="submit-btn"
          >
            {loading ? 'Submitting...' : 'Confirm & Submit Request'}
          </button>
        </div>
      )}
      
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
    </div>
  );
}

export default LeaveRequestForm;