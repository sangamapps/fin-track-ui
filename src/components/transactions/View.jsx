"use strict";

import React from "react";
import transactionService from "@services/transactionService";
import TransactionsTable from "./TransactionsTable.jsx";

export default class View extends React.Component {

    state = {
        transactions: []
    }

    updateTransaction = (transaction, transactionIndex) => {
        transactionService.update(transaction).then(data => {
            if (_.isEmpty(transactionIndex)) {
                this.state.transactions.push(transaction);
            } else {
                const existingTransaction = _.find(this.state.transactions, { _id: transaction._id });
                _.assign(existingTransaction, transaction);
            }
            this.forceUpdate();
        });
    }

    deleteTransaction = (transaction, transactionIndex) => {
        transactionService.delete(transaction._id).then(()=>{
            this.state.transactions.splice(transactionIndex, 1);
            this.forceUpdate();
        });
    }

    render() {
        return <div className="">
            <TransactionsTable transactions={this.state.transactions} updateTransaction={this.updateTransaction} deleteTransaction={this.deleteTransaction} />
        </div>;
    }

    componentDidMount(){
        transactionService.getAll().then(data => this.setState({ transactions: data.transactions}));
    }
}