"use strict";

import React from "react";
import { TRANSACTION_COLUMNS_MAP, TRANSACTION_TYPES, ACCOUNT_GROUP } from "@config";
import amountUtil from "@utils/amountUtil.js";

export default class SummaryTable extends React.Component {

    render() {
        const { transactions, accounts } = this.props;
        if (_.isEmpty(transactions) || _.isEmpty(accounts)) return <></>;

        const transactionAccountIds = _.uniq(transactions.map(tx => tx.accountId));
        const filteredAccounts = accounts.filter(acc => transactionAccountIds.includes(acc._id || acc.id) && !acc.accountGroup.includes("others"));
        
        const accountSummaries = filteredAccounts.map((account) => {
            const accountId = account._id || account.id;
            const opening = parseFloat(account.amount) || 0;

            const filteredTransactions = transactions.filter(tx => tx.accountId === accountId);

            const grouped = _.groupBy(filteredTransactions, "transactionType");
            const debits = _.sumBy(grouped[TRANSACTION_TYPES.DEBIT], tx => tx[TRANSACTION_COLUMNS_MAP.AMOUNT]);
            const credits = _.sumBy(grouped[TRANSACTION_TYPES.CREDIT], tx => tx[TRANSACTION_COLUMNS_MAP.AMOUNT]);

            const closing = opening + credits - debits;

            return {
                name: account.name,
                accountGroup: ACCOUNT_GROUP[account.accountGroup],
                opening,
                debits,
                credits,
                closing
            };
        });

        const cumulative = {
            opening: _.sumBy(accountSummaries, "opening"),
            debits: _.sumBy(accountSummaries, "debits"),
            credits: _.sumBy(accountSummaries, "credits"),
        };
        cumulative.closing = cumulative.opening + cumulative.credits - cumulative.debits;

        return (
            <div className="mt-4">
                <h4 className="mb-3 text-primary">Summary</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped text-center shadow-sm">
                        <thead className="table-light">
                            <tr>
                                <th>Account</th>
                                <th>Opening Balance (₹)</th>
                                <th>Total Debits (₹)</th>
                                <th>Total Credits (₹)</th>
                                <th>Closing Balance (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountSummaries.map((acc, idx) => (
                                <tr key={idx}>
                                    <td>{acc.name} ({acc.accountGroup})</td>
                                    <td className="text-muted">{amountUtil.getFormattedAmount(acc.opening)}</td>
                                    <td className="text-danger">{amountUtil.getFormattedAmount(acc.debits)}</td>
                                    <td className="text-success">{amountUtil.getFormattedAmount(acc.credits)}</td>
                                    <td className="fw-bold">{amountUtil.getFormattedAmount(acc.closing)}</td>
                                </tr>
                            ))}
                            <tr className="table-secondary fw-bold">
                                <td>Total</td>
                                <td>{amountUtil.getFormattedAmount(cumulative.opening)}</td>
                                <td>{amountUtil.getFormattedAmount(cumulative.debits)}</td>
                                <td>{amountUtil.getFormattedAmount(cumulative.credits)}</td>
                                <td>{amountUtil.getFormattedAmount(cumulative.closing)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
