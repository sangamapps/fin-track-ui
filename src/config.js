export const GOOGLE_CLIENT_ID = "681626859343-dtkml0ds42u48qg1q5nr07kevma99tfk.apps.googleusercontent.com";

export const ACCOUNT_GROUP = {
    bank: "Bank",
    cash: "Cash",
    credit_card: "Credit Card",
};

export const TRANSACTION_COLUMN_DATE = "date";
export const TRANSACTION_COLUMN_DESCRIPTION = "description";
export const TRANSACTION_COLUMN_TYPE = "transactionType";
export const TRANSACTION_COLUMN_AMOUNT = "amount";
export const TRANSACTION_COLUMN_DEBIT = "debit";
export const TRANSACTION_COLUMN_CREDIT = "credit";
export const TRANSACTION_COLUMN_BALANCE = "balance";

export const TRANSACTION_COLUMNS_MAP = {
    [TRANSACTION_COLUMN_DATE]: "Date",
    [TRANSACTION_COLUMN_TYPE]: "Transaction Type",
    [TRANSACTION_COLUMN_AMOUNT]: "Amount",
    [TRANSACTION_COLUMN_BALANCE]: "Balance",
    [TRANSACTION_COLUMN_DESCRIPTION]: "Description",
};

export const EXTRACTORS_MAP = {
    "HDFC_AS_XLS_V1": "HDFC - XLS - V1",
    "SBI_AS_XLS_V1": "SBI - XLS - V1",
    "AXIS_AS_PDF_V1": "AXIS - PDF - V1",
};