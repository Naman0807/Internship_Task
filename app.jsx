import React, { useState, useEffect } from 'react';

function App() {
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data from backend
  const fetchLoanData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/loans');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLoanData(data);
      setLastUpdated(new Date().toLocaleString());
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching loan data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchLoanData(); // Initial fetch
    
    const interval = setInterval(fetchLoanData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Get status color based on loan status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Disbursed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format timestamp
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loan dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
          <button 
            onClick={fetchLoanData}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Real-Time Loan Status Dashboard
          </h1>
          <p className="text-gray-600">
            Live updates every 5 seconds • Last updated: {lastUpdated || 'Never'}
          </p>
        </div>

        {loanData && (
          <>
            {/* Loan Status Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Loan Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Loan ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {loanData.loan.loan_id}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Borrower</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {loanData.loan.user_name}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${parseFloat(loanData.loan.amount).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Current Status</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(loanData.loan.current_status)}`}>
                    {loanData.loan.current_status}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Last Updated: {formatDateTime(loanData.loan.updated_at)}
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Status Change History
              </h2>
              
              {loanData.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loanData.history.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(entry.changed_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(entry.old_status)}`}>
                              {entry.old_status}
                            </span>
                            <span className="text-gray-500">→</span>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(entry.new_status)}`}>
                              {entry.new_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No status changes recorded yet.</p>
                  <p className="text-sm mt-2">
                    The system will automatically track changes when the status is updated.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Real-Time Loan Status Automation System</p>
          <p>Auto-refresh enabled • Updates every 5 seconds</p>
        </div>
      </div>
    </div>
  );
}

export default App;