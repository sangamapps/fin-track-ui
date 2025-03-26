"use strict";

import React from "react";
import * as XLSX from "xlsx";

const TransactionsExtractor = require("./extractor");
const ColumnNameMapper = require("./extractor/ColumnNameMapper");

export default class Upload extends React.PureComponent {

    state = {
        extractor: "HDFC_AST_XLS_V1",
        transactions: [],
        processed_transactions: [],
    }

    handleExtractorChange = (e) => {
        this.setState({ extractor: e.target.value });
    }

    handleFileUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;
        const reader = new FileReader();

        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
            const transactions = TransactionsExtractor.extract(this.state.extractor, jsonData);
            console.log(transactions);
            const processed_transactions = TransactionsExtractor.renameColumns(transactions);
            console.log(processed_transactions);

            this.setState({ transactions, processed_transactions });
        };

        reader.readAsArrayBuffer(file);
    }

    showSummary() {
        const transactions = this.state.processed_transactions;
        if (transactions.length === 0) {
            return;
        }
        const totalDebits = _.sumBy(transactions, (transaction) => {
            return transaction[ColumnNameMapper.GENERIC_COLUMN_NAMES.DEBIT];
        });
        const totalCredits = _.sumBy(transactions, (transaction) => {
            return transaction[ColumnNameMapper.GENERIC_COLUMN_NAMES.CREDIT];
        });
        const closingBalance = transactions[this.state.transactions.length - 1][ColumnNameMapper.GENERIC_COLUMN_NAMES.BALANCE];
        return <div>
            <div>Summary</div>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Total Debits</th>
                        <th>Total Credits</th>
                        <th>Closing Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{totalDebits}</td>
                        <td>{totalCredits}</td>
                        <td>{closingBalance}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    }

    getColumns(transaction, tr_i) {
        return <tr key={tr_i}>{ColumnNameMapper.getGenericColumnNameKeys().map((key, td_i) => {
            return <td key={td_i}>{transaction[key]}</td>;
        })}</tr>;

    }

    showTransactions() {
        const transactions = this.state.processed_transactions;
        if (transactions.length === 0) {
            return;
        }
        return <div>
            <div>Transactions</div>
            <table border={1}>
                <thead>
                    <tr>
                        {ColumnNameMapper.getGenericColumnNameValues().map((column, index) => {
                            return <th key={index}>{column}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(this.getColumns)}
                </tbody>
            </table>
        </div>;
    }

    render() {
        return <div className="">
            <div>
                <div>
                    <div>
                        <label>Select Extractor</label>
                    </div>
                    <div>
                        <select value={this.state.extractor} onChange={this.handleExtractorChange}>
                            {TransactionsExtractor.getExtractorKeys().map((extractor, index) => {
                                return <option key={index} value={extractor}>{TransactionsExtractor.getExtractorName(extractor)}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        <label>Upload File</label>
                    </div>
                    <div>
                        <input type="file" onChange={this.handleFileUpload} />
                    </div>
                </div>
            </div>
            {this.showSummary()}
            {this.showTransactions()}
        </div>;
    }
}