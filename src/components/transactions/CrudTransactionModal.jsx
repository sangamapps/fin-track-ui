"use strict";

import React from "react";
import Modal from "@modal/Modal.jsx";
import { ACCOUNT_GROUP, TRANSACTION_TYPES } from "@config";

function getDerivedStateFromProps(props) {
    return {
        date: props.transaction?.date || moment().format("YYYY-MM-DD"),
        transactionType: props.transaction?.transactionType || TRANSACTION_TYPES.DEBIT,
        account: props.transaction?.account || "",
        amount: props.transaction?.amount || 0,
        description: props.transaction?.description || "",
    };
}

export default class CrudTransactionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = getDerivedStateFromProps(props);
        this.formRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.transaction !== this.props.transaction) {
            this.setState(getDerivedStateFromProps(this.props));
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { date, description, account, transactionType, amount } = this.state;

        const transaction = _.assign(this.props.transaction, {
            date,
            description,
            account,
            transactionType,
            amount: parseFloat(amount),
        });

        this.props.onSave(transaction, this.props.transactionIndex)
    };

    getModalTitle() {
        return this.props.transaction ? "Edit Transaction" : "Add Transaction";
    }

    onSubmitClick = () => {
        if (this.formRef.current) {
            this.formRef.current.requestSubmit();
        }
    }

    getModalBody() {
        const { date, description, account, transactionType, amount } = this.state;
        const { accountsMap } = this.props;
        return (
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" name="date" value={date} onChange={this.handleChange} required />
                </div>
                <div className="mb-2">
                    <label className="form-label">Transaction Type</label>
                    <select className="form-select" name="transactionType" value={transactionType} onChange={this.handleChange} required>
                        <option value=""></option>
                        <option value="DEBIT">Debit</option>
                        <option value="CREDIT">Credit</option>
                    </select>
                </div>
                {accountsMap && <div className="mb-2">
                    <label className="form-label">Account</label>
                    <select className="form-select" name="account" value={account} onChange={this.handleChange} required>
                        <option value=""></option>
                        {_.values(accountsMap).map((account, index) => (
                            <option key={index} value={account._id}>{account.name} ({ACCOUNT_GROUP[account.accountGroup]})</option>
                        ))}
                    </select>
                </div>}
                <div className="mb-2">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" name="amount" value={amount} onChange={this.handleChange} required />
                </div>
                <div className="mb-2">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" name="description" value={description} onChange={this.handleChange} />
                </div>
            </form>
        );
    }

    render() {
        return <Modal show={this.props.show} title={this.getModalTitle()} body={this.getModalBody()} onClose={this.props.onClose} onSubmitClick={this.onSubmitClick} />;
    }
}
