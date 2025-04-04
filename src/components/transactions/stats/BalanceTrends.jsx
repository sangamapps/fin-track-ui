import React from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";

const BalanceTrends = ({ filteredTransactions, timeFilter }) => {
    const accountsMap = useSelector(state => state.user.accountsMap);
    let cumulativeBalance = statsUtil.getCummulativeBalance(filteredTransactions, accountsMap);

    const trendData = {};
    filteredTransactions.forEach(txn => {
        const date = statsUtil.formatDate(timeFilter, txn.date);
        if (!trendData[date]) {
            trendData[date] = cumulativeBalance;
        }
        if (txn.transactionType === "CREDIT") {
            cumulativeBalance += txn.amount;
        } else {
            cumulativeBalance += -txn.amount;
        }
        trendData[date] = cumulativeBalance;
    });

    const labels = Object.keys(trendData);
    const balanceData = labels.map(date => trendData[date]);
    const datasets = [{
        label: "Balance (INR)",
        data: balanceData,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true
    }];

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">Balance Trends Over Time</h5>
            <div className="chart-container">
                <Bar data={{ labels, datasets }} />
            </div>
        </div>
    );
};

export default BalanceTrends;