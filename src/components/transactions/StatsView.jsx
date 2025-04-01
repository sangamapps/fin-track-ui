"use strict";

import React, { useState } from "react";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function StatsView({ filteredTransactions }) {
    const [groupBy, setGroupBy] = useState("accountGroup");

    const handleGroupChange = (event) => {
        setGroupBy(event.target.value);
    };

    const getBarChartData = () => {
        const totals = {};

        filteredTransactions.forEach(txn => {
            const key = groupBy === "tags"
                ? txn.tags.length > 0 ? txn.tags.join(", ") : "Others"
                : txn[groupBy];

            if (!totals[key]) {
                totals[key] = { name: key, CREDIT: 0, DEBIT: 0 };
            }
            totals[key][txn.transactionType] += txn.amount;
        });

        return Object.values(totals);
    };

    const getLineChartData = () => {
        const groupedData = {};

        filteredTransactions.forEach(txn => {
            const key = groupBy === "tags"
                ? txn.tags.length > 0 ? txn.tags.join(", ") : "Others"
                : txn[groupBy];

            if (!groupedData[txn.date]) groupedData[txn.date] = {};
            groupedData[txn.date][key] = (groupedData[txn.date][key] || 0) + txn.amount;
        });

        return Object.keys(groupedData)
            .sort()
            .map(date => ({ date, ...groupedData[date] }));
    };

    const barChartData = getBarChartData();
    const lineChartData = getLineChartData();
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF69B4"];

    return (
        <div className="container mt-3">
            <h3 className="mb-4 text-center">Statistics Overview</h3>

            {/* Dropdown for grouping selection */}
            <div className="mb-4 text-center">
                <label className="me-2 fw-bold">Group By:</label>
                <select className="form-select d-inline w-auto" value={groupBy} onChange={handleGroupChange}>
                    <option value="accountGroup">Account Group</option>
                    <option value="accountName">Account Name</option>
                    <option value="tags">Tags</option>
                </select>
            </div>

            <div className="row">
                {/* Transaction Distribution Bar Chart */}
                <div className="col-lg-6 col-md-12 mb-3">
                    <div className="card card-body shadow">
                        <h5 className="text-center mb-3">Transaction Distribution by {groupBy === "tags" ? "Tags" : groupBy === "accountName" ? "Account Name" : "Account Group"}</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="CREDIT" fill="#00C49F" name="Credit" />
                                <Bar dataKey="DEBIT" fill="#FF8042" name="Debit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transaction Trends Line Chart */}
                <div className="col-lg-6 col-md-12 mb-3">
                    <div className="card card-body shadow">
                        <h5 className="text-center mb-3">Transaction Trends Over Time ({groupBy === "tags" ? "Tags" : groupBy === "accountName" ? "Account Name" : "Account Group"})</h5>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" angle={-45} textAnchor="end" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend />
                                {Object.keys(lineChartData[0] || {}).slice(1).map((key, index) => (
                                    <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} name={key} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
