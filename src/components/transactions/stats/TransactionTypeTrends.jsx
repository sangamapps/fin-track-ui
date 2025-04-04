import React from "react";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";
import { TRANSACTION_TYPES_LABEL_MAP } from "@config";

const TransactionTypeTrends = ({ filteredTransactions, timeFilter, transactionType }) => {
    const transactionTypeLabel = TRANSACTION_TYPES_LABEL_MAP[transactionType];

    const trendData = {};
    filteredTransactions.forEach(txn => {
        const date = statsUtil.formatDate(timeFilter, txn.date);
        if (!trendData[date]) {
            trendData[date] = 0;
        }
        if (txn.transactionType === transactionType) {
            trendData[date] += txn.amount;
        }
    });

    const labels = Object.keys(trendData);
    const transactionData = labels.map(date => trendData[date]);
    const datasets = [{
        label: `${transactionTypeLabel} Transactions (INR)`,
        data: transactionData,
        borderColor: transactionType === "CREDIT" ? "#28a745" : "#dc3545",
        backgroundColor: transactionType === "CREDIT" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
        fill: true
    }];

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">{transactionTypeLabel} Over Time</h5>
            <div className="chart-container">
                <Bar data={{ labels, datasets }} />
            </div>
        </div>
    );
};

export default TransactionTypeTrends;
