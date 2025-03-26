"use strict";

const GENERIC_COLUMN_NAMES = {
    DATE: "Date",
    DESCRIPTION: "Description",
    DEBIT: "Debit",
    CREDIT: "Credit",
    BALANCE: "Balance",
}

const COLUMN_NAME_MAP = {
    // HDFC
    "Date": GENERIC_COLUMN_NAMES.DATE,
    "Narration": GENERIC_COLUMN_NAMES.DESCRIPTION,
    "Chq./Ref.No.": null,
    "Value Dt": null,
    "Withdrawal Amt.": GENERIC_COLUMN_NAMES.DEBIT,
    "Deposit Amt.": GENERIC_COLUMN_NAMES.CREDIT,
    "Closing Balance": GENERIC_COLUMN_NAMES.BALANCE,
    //SBI
    "Txn Date": GENERIC_COLUMN_NAMES.DATE,
    "Value Date": null,
    "Description": GENERIC_COLUMN_NAMES.DESCRIPTION,
    "Ref No./Cheque No.": null,
    "Debit": GENERIC_COLUMN_NAMES.DEBIT,
    "Credit": GENERIC_COLUMN_NAMES.CREDIT,
    "Balance": GENERIC_COLUMN_NAMES.BALANCE,
}

function getGenericColumnNameKeys() {
    return Object.values(GENERIC_COLUMN_NAMES);
}

function getGenericColumnNameValues() {
    return Object.values(GENERIC_COLUMN_NAMES);
}

function convertToGenericColumnName(columnName) {
    return COLUMN_NAME_MAP[columnName] || null;
}

function processColumnValue(columnName, value){
    switch(columnName){
        case GENERIC_COLUMN_NAMES.DATE:
            return moment(value).calendar();
        case GENERIC_COLUMN_NAMES.DEBIT:
        case GENERIC_COLUMN_NAMES.CREDIT:
        case GENERIC_COLUMN_NAMES.BALANCE:
            value = _.isString(value) ? _.trim(value) : value;
            return value ? parseFloat(value) : 0;
        default:
            return value;
    }
}

module.exports = {
    GENERIC_COLUMN_NAMES,
    getGenericColumnNameKeys,
    getGenericColumnNameValues,
    convertToGenericColumnName,
    processColumnValue,
}