import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

const TransactionAmountSum = ({ filteredTransactions }) => {
    const rules = useSelector(state=>state.user.rules);
    let sums = rules.map(({ _id, tag}) => {
        const txns = filteredTransactions.filter(txn => txn.appliedRules[_id] == 1);
        return { label: tag, sum: _.sumBy(txns, "amount") };
    });
    sums.push({
        label: "Untagged",
        sum: _.sumBy(filteredTransactions.filter(txn => txn.tags.length == 0), "amount"),
    });
    sums = sums.filter(s => s.sum > 0);

    const chartData = {
        labels: sums.map(g => g.label),
        datasets: [
            {
                label: "Total Amount (INR)",
                data: sums.map(g => g.sum),
                backgroundColor: "rgba(163, 40, 167, 0.63)",
            },
        ],
    };

    return (
        <div className="card shadow-sm p-3">
            <h5 className="card-title">Total Amount by Tags</h5>
            <div className="chart-container">
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default TransactionAmountSum;
