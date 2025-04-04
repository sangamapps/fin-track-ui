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
    }
};