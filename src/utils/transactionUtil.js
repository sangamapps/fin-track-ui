import ruleUtil from "./ruleUtil";
import { ACCOUNT_GROUP } from "@config";

export default {
    applyFilters: (transactions, filters, accountsMap, rules) => {
        return _.filter(transactions, (transaction) => {
            const account = accountsMap && accountsMap[transaction.accountId] || {};
            transaction.accountGroup = ACCOUNT_GROUP[account.accountGroup] || "";
            transaction.accountName = account.name || "";
            if (!_.isEmpty(filters.accountGroupFilter) && account.accountGroup != filters.accountGroupFilter) return false;
            if (!_.isEmpty(filters.accountIdFilter) && transaction.accountId != filters.accountIdFilter) return false;
            if (!_.isEmpty(filters.transactionTypeFilter) && transaction.transactionType != filters.transactionTypeFilter) return false;
            ruleUtil.applyRules(transaction, rules);
            if (!_.isEmpty(filters.tagFilter)) {
                if (filters.tagFilter == "__NONE__" && transaction.tags.length == 0) return true;
                if (filters.tagFilter in transaction.appliedRules && transaction.appliedRules[filters.tagFilter] == 1) return true;
                return false;
            }
            if (!_.isEmpty(filters.searchFilter) && !_.includes(_.lowerCase(transaction.description), _.lowerCase(filters.searchFilter))) return false;
            return true;
        });
    }
}