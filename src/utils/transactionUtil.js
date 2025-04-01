import ruleUtil from "./ruleUtil";

export default {
    applyFilters: (transactions, filters, accountsMap, rules) => {
        return _.filter(transactions, (transaction) => {
            if (!_.isEmpty(filters.accountGroupFilter) && accountsMap[transaction.accountId].accountGroup != filters.accountGroupFilter) return false;
            if (!_.isEmpty(filters.accountIdFilter) && transaction.accountId != filters.accountIdFilter) return false;
            if (!_.isEmpty(filters.transactionTypeFilter) && transaction.transactionType != filters.transactionTypeFilter) return false;
            ruleUtil.applyRules(transaction, rules);
            if (!_.isEmpty(filters.tagFilter)) {
                if (filters.tagFilter == "__NONE__" && _.size(_.pickBy(transaction.appliedRules, v => v == 1)) == 0) return transaction;
                if (filters.tagFilter in transaction.appliedRules && transaction.appliedRules[this.state.tagFilter] == 1) return transaction;
                return false;
            }
            if (!_.isEmpty(filters.searchFilter) && !_.includes(_.lowerCase(transaction.description), _.lowerCase(filters.searchFilter))) return false;
            return true;
        });
    }
}