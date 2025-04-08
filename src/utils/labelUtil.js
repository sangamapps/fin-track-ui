import { TRANSACTION_TYPES_LABELS, ACCOUNT_TYPE_LABELS } from "@config";

export default {
    getTransactionTypeLabel: (transactionType) => {
        return TRANSACTION_TYPES_LABELS[transactionType];
    },
    getAccountLabel: (account) => {
        return account.name + ' (' + ACCOUNT_TYPE_LABELS[account.type] + ')';
    }
}