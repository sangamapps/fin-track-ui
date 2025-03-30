"use strict";

import React from "react";
import { toast } from 'react-toastify';
import { EXTRACTORS_MAP } from "@config";
import TransactionsTable from "./TransactionsTable.jsx";
import accountService from "@services/accountService";
import transactionService from "@services/transactionService";
// import processedTransactionsSample from "./processedTransactionsSample.json";

export default class Upload extends React.Component {
    state = {
        selectedExtractor: _.keys(EXTRACTORS_MAP)[0],
        selectedFile: null,
        transactions: [],
        extractionStatus: false,
        extracted: 0,
        selectedAccount: "",
        accounts: [],
    };

    handleExtractorChange = (e) => {
        this.setState({ selectedExtractor: e.target.value, transactions: [], extracted: 0 });
    };

    handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return this.setState({ selectedFile: null, transactions: [], extracted: 0 });
        this.setState({ selectedFile: file, transactions: [], extracted: 0 });
    };

    getTransactions = () => {
        if (!this.state.selectedFile) return toast.warn("Please select a file");
        this.setState({ extractionStatus: true, extracted: 0 });
        transactionService.extract(this.state.selectedExtractor, this.state.selectedFile).then(data => {
            this.setState({ transactions: data.processed_transactions, extractionStatus: false, extracted: 1 });
        }).catch(err => {
            this.setState({ transactions: [], extractionStatus: false, extracted: 0 });
            toast.error(err.message);
        });
    }

    getUploadCard() {
        return <div className="p-3 shadow mb-3">
            <h3 className="mb-3">Upload Statement</h3>
            <div className="mb-3">
                <label className="form-label">Select Extractor</label>
                <select className="form-select" value={this.state.selectedExtractor} onChange={this.handleExtractorChange}>
                    {_.keys(EXTRACTORS_MAP).map((extractor, index) => (
                        <option key={index} value={extractor}>{EXTRACTORS_MAP[extractor]}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Upload File</label>
                <input type="file" className="form-control" onChange={this.handleFileUpload} />
            </div>
            <div>
                <button className="btn btn-primary" onClick={this.getTransactions}>Extract</button>
            </div>
        </div>;
    }

    updateTransaction = (transaction, transactionIndex, callback = () => {}) => {
        this.state.transactions[transactionIndex] = _.assign(this.state.transactions[transactionIndex], transaction);
        callback();
    }

    deleteTransaction = (transaction, transactionIndex) => {
        this.state.transactions.splice(transactionIndex, 1);
    }

    showTransactions() {
        const transactions = this.state.transactions;
        if (transactions.length == 0) {
            if (this.state.extractionStatus) {
                return <div className="mt-4 d-flex justify-content-center">
                    <div className="spinner-border text-primary text-center" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>;
            }
            if (this.state.extracted) {
                return <div className="mt-4 alert alert-danger">No transactions found</div>;
            }
            return;
        }
        return <TransactionsTable transactions={transactions} updateTransaction={this.updateTransaction} deleteTransaction={this.deleteTransaction} />;
    }

    handleAccountChange = (e) => {
        this.setState({ selectedAccount: e.target.value });
    }

    bulkSave = () => {
        transactionService.bulkSave(this.state.selectedAccount, this.state.transactions).then(()=>toast.info("Successfully saved transactions. Can be viewed in View page."));
    }

    getBulkSaveCard() {
        const { selectedAccount, accounts, transactions } = this.state;
        if (_.isEmpty(transactions)) return;
        return <div className="p-3 shadow-lg">
            <div className="mb-3">
                <select className="form-select" value={selectedAccount} onChange={this.handleAccountChange}>
                    <option value="">Select Account</option>
                    {accounts.map((account, index) => (
                        <option key={index} value={account._id}>{account.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <button className="btn btn-primary" disabled={_.isEmpty(selectedAccount)} onClick={this.bulkSave}>Bulk Save</button>
            </div>
        </div>;
    }

    render() {
        return (
            <div className="mb-3">
                {this.getUploadCard()}
                {this.showTransactions()}
                {this.getBulkSaveCard()}
            </div>
        );
    }

    getAccounts = () => {
        accountService.getAll().then(data => this.setState({ accounts: data.accounts }));
    }

    componentDidMount() {
        this.getAccounts();
    }
}