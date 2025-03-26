"use strict";

import React from "react";
import * as XLSX from "xlsx";

const TransactionsExtractor = require("./extractor");
const ColumnNameMapper = require("./extractor/ColumnNameMapper");

export default class Upload extends React.PureComponent {
    state = {
        extractor: "HDFC_AST_XLS_V1",
        isFileChosen: false,
        transactions: [],
        processed_transactions: [],
    };

    handleExtractorChange = (e) => {
        this.setState({ extractor: e.target.value });
    };

    handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return this.setState({ transactions: [], processed_transactions: [], isFileChosen: false });

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
            const transactions = TransactionsExtractor.extract(this.state.extractor, jsonData);
            const processed_transactions = TransactionsExtractor.renameColumns(transactions);
            this.setState({ transactions, processed_transactions, isFileChosen: true });
        };
        reader.readAsArrayBuffer(file);
    };

    showSummary() {
        const transactions = this.state.processed_transactions;
        if (transactions.length === 0) return;
        const totalDebits = _.sumBy(transactions, (transaction) => transaction[ColumnNameMapper.GENERIC_COLUMN_NAMES.DEBIT]);
        const totalCredits = _.sumBy(transactions, (transaction) => transaction[ColumnNameMapper.GENERIC_COLUMN_NAMES.CREDIT]);
        const closingBalance = transactions[this.state.transactions.length - 1][ColumnNameMapper.GENERIC_COLUMN_NAMES.BALANCE];
        return (
            <div className="mt-4">
                <h5>Summary</h5>
                <table className="table table-bordered">
                    <thead className="table-dark">
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
        );
    }

    getColumns(transaction, tr_i) {
        return (
            <tr key={tr_i}>{ColumnNameMapper.getGenericColumnNameKeys().map((key, td_i) => <td key={td_i}>{transaction[key]}</td>)}</tr>
        );
    }

    showTransactions() {
        const transactions = this.state.processed_transactions;
        if (transactions.length === 0) {
            if (this.state.isFileChosen) {
                return <div className="mt-4 alert alert-danger"> No transactions found</div>;
            }
            return;
        }
        return (
            <div className="mt-4">
                <h5>Transactions</h5>
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            {ColumnNameMapper.getGenericColumnNameValues().map((column, index) => <th key={index}>{column}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(this.getColumns)}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div className="container mt-4">
                <div className="card p-4 shadow-lg">
                    <h3 className="mb-3">Upload Bank Statement</h3>
                    <div className="mb-3">
                        <label className="form-label">Select Extractor</label>
                        <select className="form-select" value={this.state.extractor} onChange={this.handleExtractorChange}>
                            {TransactionsExtractor.getExtractorKeys().map((extractor, index) => (
                                <option key={index} value={extractor}>{TransactionsExtractor.getExtractorName(extractor)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload File</label>
                        <input type="file" className="form-control" onChange={this.handleFileUpload} />
                    </div>
                </div>
                {this.showSummary()}
                {this.showTransactions()}
            </div>
        );
    }
}