import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";

const TransactionAmountSum = ({ filteredTransactions }) => {
  const sums = useMemo(() => {
    return statsUtil.getTransactionAmountRange().map(({ label, min, max }) => {
      const txns = filteredTransactions.filter(txn => txn.amount >= min && txn.amount < max);
      return { label, sum: _.sumBy(txns, "amount") };
    });
  }, [filteredTransactions]);

  const chartData = {
    labels: sums.map(g => g.label),
    datasets: [
      {
        label: "Total Amount (INR)",
        data: sums.map(g => g.sum),
        backgroundColor: "rgba(40, 167, 69, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (INR)" },
      },
    },
  };

  return (
    <div className="card shadow-sm p-3">
      <h5 className="card-title">Total Amount by Transaction Range</h5>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionAmountSum;
