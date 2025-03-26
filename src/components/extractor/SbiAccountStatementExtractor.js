"use strict";

function getTransactionsFromXlsV1(jsonData) {

    const columns = [
        "Txn Date",
        "Value Date",
        "Description",
        "Ref No./Cheque No.",
        "        Debit",
        "Credit",
        "Balance"
    ];

    const START_PATTERN = JSON.stringify(columns);

    const END_PATTERN = JSON.stringify([]);

    const transactions = [];

    let start = false;
    for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (JSON.stringify(row) === START_PATTERN) {
            start = true;
            continue;
        }
        if (!start) {
            continue;
        }
        if (JSON.stringify(row) === END_PATTERN) {
            break;
        }
        const transaction = {};
        for (let j = 0; j < columns.length; j++) {
            transaction[columns[j]] = row[j];
        }
        transactions.push(transaction);
    }

    return transactions;
}

module.exports = {
    getTransactionsFromXlsV1,
}