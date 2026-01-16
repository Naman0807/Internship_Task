import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import LoanDetail from "./LoanDetail";

function App() {
	return (
		<Router>
			<div className="min-h-screen">
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/loan/:loanId" element={<LoanDetail />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
