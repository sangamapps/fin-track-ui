import React from "react";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";

const TransactionAmountCount = ({ filteredTransactions }) => {
    const counts = statsUtil.getTransactionAmountRange().map(({ label, min, max }) => {
        const count = filteredTransactions.filter(txn => txn.amount >= min && txn.amount <= max).length;
        return { label, count };
    });

    const chartData = {
        labels: counts.map(g => g.label),
        datasets: [
            {
                label: "No. of Transactions",
                data: counts.map(g => g.count),
                backgroundColor: "rgb(255, 162, 0)",
            },
        ],
    };

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">Transaction Count by Amount Range</h5>
            <div className="chart-container">
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default TransactionAmountCount;
