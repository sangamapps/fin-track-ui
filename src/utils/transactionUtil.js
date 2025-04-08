import ruleUtil from "./ruleUtil";

export default {
    applyFilters: (transactions, filters, accountsMap, rules) => {
        return _.filter(transactions, (transaction) => {
            if (!_.isEmpty(filters.minAmountFilter) && transaction.amount < filters.minAmountFilter) return false;
            if (!_.isEmpty(filters.maxAmountFilter) && transaction.amount > filters.maxAmountFilter) return false;
            if (!_.isEmpty(filters.excludeFromTotalsFilter) && transaction.excludeFromTotals != filters.excludeFromTotalsFilter) return false;
            const account = accountsMap && accountsMap[transaction.accountId] || {};
            transaction.account = account;
            if (!_.isEmpty(filters.accountTypeFilter) && account.type != filters.accountTypeFilter) return false;
            if (!_.isEmpty(filters.accountIdFilter) && transaction.accountId != filters.accountIdFilter) return false;
            if (!_.isEmpty(filters.transactionTypeFilter) && transaction.type != filters.transactionTypeFilter) return false;
            ruleUtil.applyRules(transaction, rules);
            if (!_.isEmpty(filters.tagFilter)) {
                if (filters.tagFilter == "__NONE__") {
                    if (transaction.tags.length > 0) {
                        return false;
                    }
                } else if (!transaction.appliedRules[filters.tagFilter]) {
                    return false;
                }
            }
            if (!_.isEmpty(filters.searchFilter) && !_.includes(_.toLower(transaction.description), _.toLower(filters.searchFilter))) return false;
            return true;
        });
    }
}