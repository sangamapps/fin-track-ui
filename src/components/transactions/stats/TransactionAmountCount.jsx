import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import statsUtil from "@utils/statsUtil";

const TransactionAmountCount = ({ filteredTransactions }) => {
  const counts = useMemo(() => {
    return statsUtil.getTransactionAmountRange().map(({ label, min, max }) => {
      const count = filteredTransactions.filter(txn => txn.amount >= min && txn.amount < max).length;
      return { label, count };
    });
  }, [filteredTransactions]);

  const chartData = {
    labels: counts.map(g => g.label),
    datasets: [
      {
        label: "No. of Transactions",
        data: counts.map(g => g.count),
        backgroundColor: "rgba(0, 123, 255, 0.6)",
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
        title: { display: true, text: "Transaction Count" },
      },
    },
  };

  return (
    <div className="card shadow-sm p-3">
      <h5 className="card-title">Transaction Count by Amount Range</h5>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TransactionAmountCount;
