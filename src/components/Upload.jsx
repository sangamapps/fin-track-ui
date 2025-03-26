"use strict";

import React from "react";
import { toast } from 'react-toastify';
import Extractor from "./Extractor";

const EXTRACTORS_MAP = {
    "HDFC_AS_XLS_V1": "HDFC - XLS - V1",
    "SBI_AS_XLS_V1": "SBI - XLS - V1",
    "AXIS_AS_PDF_V1": "AXIS - PDF - V1",
};

const COLUMNS = [
    "DATE",
    "DESCRIPTION",
    "DEBIT",
    "CREDIT",
    "BALANCE",
]

const COLUMN_DEBIT = "DEBIT";
const COLUMN_CREDIT = "CREDIT";
const COLUMN_BALANCE = "BALANCE";

export default class Upload extends React.PureComponent {
    state = {
        chosenExtractor: "HDFC_AS_XLS_V1",
        isFileChosen: false,
        transactions: [],
        processed_transactions: [],
    };

    handleExtractorChange = (e) => {
        this.setState({ chosenExtractor: e.target.value, transactions: [], processed_transactions: [], isFileChosen: false });
    };

    handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return this.setState({ transactions: [], processed_transactions: [], isFileChosen: false });
        Extractor.getTransactions(this.state.chosenExtractor, file).then(data => {
            this.setState({ transactions: data.transactions, processed_transactions: data.processed_transactions, isFileChosen: true });
        }).catch(err => {
            toast.error(err.message);
        });
    };

    showSummary() {
        const transactions = this.state.processed_transactions;
        if (transactions.length === 0) return;
        const totalDebits = _.sumBy(transactions, (transaction) => transaction[COLUMN_DEBIT]);
        const totalCredits = _.sumBy(transactions, (transaction) => transaction[COLUMN_CREDIT]);
        const closingBalance = transactions[this.state.transactions.length - 1][COLUMN_BALANCE];
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
            <tr key={tr_i}>{COLUMNS.map((key, td_i) => <td key={td_i}>{transaction[key]}</td>)}</tr>
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
                            {COLUMNS.map((column, index) => <th key={index}>{column}</th>)}
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
                    <h3 className="mb-3">Upload Account/Credit Card Statement</h3>
                    <div className="mb-3">
                        <label className="form-label">Select Extractor</label>
                        <select className="form-select" value={this.state.chosenExtractor} onChange={this.handleExtractorChange}>
                            {Object.keys(EXTRACTORS_MAP).map((extractor, index) => (
                                <option key={index} value={extractor}>{EXTRACTORS_MAP[extractor]}</option>
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