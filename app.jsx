import React, { useState, useEffect } from "react";

function App() {
	const [loanData, setLoanData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState("all");

	const fetchLoanData = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/loans");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setLoanData(data);
			setLastUpdated(new Date().toLocaleString());
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLoanData();
		const interval = setInterval(fetchLoanData, 5000);
		return () => clearInterval(interval);
	}, []);

	const getStatusColor = (status) => {
		switch (status) {
			case "Applied":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "Approved":
				return "bg-green-100 text-green-800 border-green-300";
			case "Disbursed":
				return "bg-blue-100 text-blue-800 border-blue-300";
			case "Rejected":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	};

	const formatDateTime = (dateString) => {
		return new Date(dateString).toLocaleString();
	};

	const getFilteredHistory = () => {
		if (!loanData?.history) return [];
		if (selectedFilter === "all") return loanData.history;

		return loanData.history.filter(
			(entry) => entry.new_status === selectedFilter
		);
	};

	const getFilterButtonStyle = (filter) => {
		const baseClass = "px-4 py-2 rounded-lg font-medium transition-colors";
		return selectedFilter === filter
			? `${baseClass} ${getStatusColor(filter)}`
			: `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300`;
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-gray-600">
				Loading loan data...
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					<strong>Error:</strong> {error}
					<div className="mt-4 text-center">
						<button
							onClick={fetchLoanData}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Retry
						</button>
					</div>
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
						Live updates every 5 seconds • Last updated: {lastUpdated}
					</p>
				</div>

				{/* Loan Details */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Loan Details
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-600">Loan ID</p>
							<p className="text-lg font-semibold">{loanData.loan.loan_id}</p>
						</div>

						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-600">Borrower</p>
							<p className="text-lg font-semibold">{loanData.loan.user_name}</p>
						</div>

						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-600">Amount</p>
							<p className="text-lg font-semibold">
								${Number(loanData.loan.amount).toLocaleString()}
							</p>
						</div>

						<div className="bg-gray-50 p-4 rounded">
							<p className="text-sm text-gray-600">Current Status</p>
							<span
								className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
									loanData.loan.current_status
								)}`}
							>
								{loanData.loan.current_status}
							</span>
						</div>
					</div>

					<div className="mt-4 text-sm text-gray-500">
						Last Updated: {formatDateTime(loanData.loan.updated_at)}
					</div>
				</div>

				{/* Status History */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">
						Status Change History
					</h2>

					{/* Filters */}
					<div className="flex flex-wrap gap-2 justify-center mb-6">
						{["all", "Applied", "Approved", "Disbursed", "Rejected"].map(
							(status) => (
								<button
									key={status}
									onClick={() => setSelectedFilter(status)}
									className={getFilterButtonStyle(status)}
								>
									{status === "all" ? "All Status" : status}
								</button>
							)
						)}
					</div>

					{getFilteredHistory().length === 0 ? (
						<p className="text-center text-gray-500">
							No status changes found.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Date & Time
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Status Change
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{getFilteredHistory().map((entry) => (
										<tr key={entry.id}>
											<td className="px-6 py-4 text-sm">
												{formatDateTime(entry.changed_at)}
											</td>
											<td className="px-6 py-4 text-sm">
												<span
													className={`px-2 py-1 rounded-full border text-xs mr-2 ${getStatusColor(
														entry.old_status
													)}`}
												>
													{entry.old_status}
												</span>
												→
												<span
													className={`px-2 py-1 rounded-full border text-xs ml-2 ${getStatusColor(
														entry.new_status
													)}`}
												>
													{entry.new_status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					Auto-refresh enabled • Updates every 5 seconds
				</div>
			</div>
		</div>
	);
}

export default App;
