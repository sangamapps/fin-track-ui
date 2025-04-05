import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

const TransactionAmountSum = ({ filteredTransactions }) => {
    const rules = useSelector(state=>state.user.rules);
    const counts = rules.map(({ _id, tag}) => {
        const txns = filteredTransactions.filter(txn => txn.appliedRules[_id] == 1);
        return { label: tag, count: txns.length };
    });
    counts.push({
        label: "Untagged",
        count: filteredTransactions.filter(txn => txn.tags.length == 0).length,
    });

    const chartData = {
        labels: counts.map(g => g.label),
        datasets: [
            {
                label: "No. of Transactions",
                data: counts.map(g => g.count),
                backgroundColor: "rgba(140, 167, 40, 0.63)",
            },
        ],
    };

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">Transaction Count by Tags</h5>
            <div className="chart-container">
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default TransactionAmountSum;
