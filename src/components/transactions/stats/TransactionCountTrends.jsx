import React from "react";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";

const BalanceTrends = ({ filteredTransactions, timeFilter }) => {
    const trendData = {};
    filteredTransactions.forEach(txn => {
        const date = statsUtil.formatDate(timeFilter, txn.date);
        if (!trendData[date]) {
            trendData[date] = 0;
        }
        trendData[date] += 1;
    });

    const labels = Object.keys(trendData);
    const balanceData = labels.map(date => trendData[date]);
    const datasets = [{
        label: "Transaction Count",
        data: balanceData,
        borderColor: "#007bff",
        backgroundColor: "rgb(0, 204, 255)",
        fill: true
    }];

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">Transaction Count Over Time</h5>
            <div className="chart-container">
                <Bar data={{ labels, datasets }} />
            </div>
        </div>
    );
};

export default BalanceTrends;