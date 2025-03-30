"use strict";

import React from "react";
import { toast } from 'react-toastify';
import transactionService from "@services/transactionService";
import accountService from "@services/accountService";
import TransactionsTable from "./TransactionsTable.jsx";

export default class View extends React.Component {

    state = {
        transactions: [],
        getTransactionsLoadingStatus: true,
        accounts: [],
    }

    updateTransaction = (transaction, transactionIndex, callback = () => {}) => {
        transactionService.upsert(transaction).then(data => {
            toast.info("Transaction saved");
            if (!_.isNumber(transactionIndex)) {
                this.state.transactions.push(transaction);
            } else {
                _.assign(this.state.transactions[transactionIndex], data);
            }
            this.forceUpdate();
            callback();
        });
    }

    deleteTransaction = (transaction, transactionIndex) => {
        transactionService.delete(transaction._id).then(() => {
            toast.info("Transaction deleted");
            this.state.transactions.splice(transactionIndex, 1);
            this.forceUpdate();
        });
    }

    showTransactions() {
        const transactions = this.state.transactions;
        if (transactions.length == 0) {
            if (this.state.getTransactionsLoadingStatus) {
                return <div className="mt-4 d-flex justify-content-center">
                    <div className="spinner-border text-primary text-center" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>;
            }
        }
        return <TransactionsTable transactions={transactions} accountsMap={_.keyBy(this.state.accounts, '_id')}
            updateTransaction={this.updateTransaction} deleteTransaction={this.deleteTransaction} />;
    }

    render() {
        return <div className="">
            {this.showTransactions()}
        </div>;
    }

    getTransactions() {
        transactionService.getAll().then(data => {
            this.setState({ getTransactionsLoadingStatus: false, transactions: data.transactions });
        });
    }

    getAccounts() {
        accountService.getAll().then(data => this.setState({ accounts: data.accounts }));
    }

    componentDidMount() {
        this.getAccounts();
        this.getTransactions();
    }
}