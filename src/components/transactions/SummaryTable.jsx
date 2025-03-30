"use strict";

import React from "react";
import { TRANSACTION_COLUMNS_MAP, TRANSACTION_TYPES } from "@config";

export default class SummaryTable extends React.Component {

    render() {
        const { transactions } = this.props;
        const groupedTransactions = _.groupBy(transactions, "transactionType");
        const totalDebits = _.sumBy(groupedTransactions[TRANSACTION_TYPES.DEBIT], (transaction) => transaction[TRANSACTION_COLUMNS_MAP.AMOUNT]);
        const totalCredits = _.sumBy(groupedTransactions[TRANSACTION_TYPES.CREDIT], (transaction) => transaction[TRANSACTION_COLUMNS_MAP.AMOUNT]);
        return (
            <div className="mt-4">
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Total Debits</th>
                            <th>Total Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{totalDebits}</td>
                            <td>{totalCredits}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}