import { TRANSACTION_TYPES_LABEL_MAP } from "@config";

export default {
    getTransactionTypeLabel: (transactionType) => {
        return TRANSACTION_TYPES_LABEL_MAP[transactionType];
    }
}