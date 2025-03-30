"use strict";

import React from "react";
import transactionService from "@services/transactionService";
import TransactionsTable from "./TransactionsTable.jsx";

export default class View extends React.Component {

    state = {
        transactions: []
    }

    render() {
        return <div className="">
            <TransactionsTable transactions={this.state.transactions} />
        </div>;
    }

    componentDidMount(){
        transactionService.getAll().then(data => this.setState({ transactions: data.transactions}));
    }
}