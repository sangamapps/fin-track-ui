export default {
    formatDate: (timeFilter, date) => {
        const momentDate = moment(date);
        if (timeFilter === "daily") return momentDate.format("YYYY-MM-DD");
        if (timeFilter === "weekly") return momentDate.endOf("week").format("YYYY-MM-DD");
        if (timeFilter === "monthly") return momentDate.format("YYYY-MM");
        if (timeFilter === "yearly") return momentDate.format("YYYY");
        return "Overall";
    },
    getCummulativeBalance: (transactions, accountsMap) => {
        return _.sumBy(_.uniq(_.map(transactions, ft => ft.accountId)), a => parseFloat(accountsMap[a].amount));
    },
    getTransactionAmountRange: () => {
        return [
            { label: "< ₹50", min: 0, max: 49 },
            { label: "₹51 – ₹100", min: 51, max: 100 },
            { label: "₹101 – ₹500", min: 101, max: 500 },
            { label: "₹501 – ₹1,000", min: 501, max: 1000 },
            { label: "₹1,001 – ₹5,000", min: 1001, max: 5000 },
            { label: "₹5,001 – ₹10,000", min: 5001, max: 10000 },
            { label: "₹10,001 - ₹50,000", min: 10001, max: 50000 },
            { label: "> ₹50,001", min: 50001, max: Infinity },
        ];
    }
};