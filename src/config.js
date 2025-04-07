export const GOOGLE_CLIENT_ID = "681626859343-dtkml0ds42u48qg1q5nr07kevma99tfk.apps.googleusercontent.com";

export const ACCOUNT_GROUP = {
    bank: "Bank",
    cash: "Cash",
    credit_card: "Credit Card",
    stocks: "Stocks",
    others: "Others",
};

export const TRANSACTION_COLUMNS_MAP = {
    DATE: "date",
    ACCOUNT_GROUP: "accountGroup",
    ACCOUNT_ID: "accountId",
    DESCRIPTION: "description",
    TYPE: "transactionType",
    AMOUNT: "amount",
    DEBIT: "debit",
    CREDIT: "credit",
    BALANCE: "balance",
};

export const TRANSACTION_COLUMNS_LABEL_MAP = {
    [TRANSACTION_COLUMNS_MAP.DATE]: "Date",
    [TRANSACTION_COLUMNS_MAP.ACCOUNT_GROUP]: "Account Group",
    [TRANSACTION_COLUMNS_MAP.ACCOUNT_ID]: "Account",
    [TRANSACTION_COLUMNS_MAP.TYPE]: "Transaction Type",
    [TRANSACTION_COLUMNS_MAP.AMOUNT]: "Amount",
    [TRANSACTION_COLUMNS_MAP.DESCRIPTION]: "Description",
};

export const TRANSACTION_TYPES = {
    DEBIT: "DEBIT",
    CREDIT: "CREDIT",
};

export const TRANSACTION_TYPES_LABEL_MAP = {
    DEBIT: "Debit",
    CREDIT: "Credit",
};

export const EXTRACTORS_MAP = {
    "HDFC_AS_XLS_V1": "HDFC - XLS - V1",
    "SBI_AS_XLS_V1": "SBI - XLS - V1",
    "AXIS_AS_PDF_V1": "AXIS - PDF - V1",
};