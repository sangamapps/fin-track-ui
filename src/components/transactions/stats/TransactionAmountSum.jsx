import React from "react";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";

const TransactionAmountSum = ({ filteredTransactions }) => {
    const sums = statsUtil.getTransactionAmountRange().map(({ label, min, max }) => {
        const txns = filteredTransactions.filter(txn => txn.amount >= min && txn.amount <= max);
        return { label, sum: _.sumBy(txns, "amount") };
    });

    const chartData = {
        labels: sums.map(g => g.label),
        datasets: [
            {
                label: "Total Amount (INR)",
                data: sums.map(g => g.sum),
                backgroundColor: "rgb(40, 167, 131)",
            },
        ],
    };

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">Total Amount by Transaction Range</h5>
            <div className="chart-container">
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default TransactionAmountSum;
