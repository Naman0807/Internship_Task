import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const [loans, setLoans] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);
	const navigate = useNavigate();

	const fetchAllLoans = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/loans");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setLoans(data.loans);
			setLastUpdated(new Date().toLocaleString());
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllLoans();
		const interval = setInterval(fetchAllLoans, 5000);
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

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-gray-600">
				Loading dashboard...
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
							onClick={fetchAllLoans}
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
						Loan Management Dashboard
					</h1>
					<p className="text-gray-600">
						Live updates every 5 seconds • Last updated: {lastUpdated}
					</p>
				</div>

				{/* Loans Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{loans?.map((loan) => (
						<div
							key={loan.loan_id}
							className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
							onClick={() => navigate(`/loan/${loan.loan_id}`)}
						>
							<div className="mb-4">
								<h3 className="text-xl font-semibold text-gray-800 mb-2">
									{loan.loan_id}
								</h3>
								<p className="text-gray-600 font-medium">{loan.user_name}</p>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Loan Amount:</span>
									<span className="font-semibold">
										₹{Number(loan.amount).toLocaleString("en-IN")}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Approved Amount:</span>
									<span className="font-semibold">
										{loan.approved_amount
											? `₹${Number(loan.approved_amount).toLocaleString("en-IN")}`
											: 'N/A'}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Status:</span>
									<span
										className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
											loan.current_status
										)}`}
									>
										{loan.current_status}
									</span>
								</div>
							</div>

							<div className="mt-4 pt-4 border-t border-gray-200">
								<div className="text-xs text-gray-500">
									Last Updated: {formatDateTime(loan.updated_at)}
								</div>
							</div>

							<div className="mt-4">
								<button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
									View Details →
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					Auto-refresh enabled • Updates every 5 seconds
				</div>
			</div>
		</div>
	);
}

export default Dashboard;