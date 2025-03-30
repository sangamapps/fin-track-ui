"use strict";

import React from "react";
import Modal from "@modal/Modal.jsx";

function getDerivedStateFromProps(props) {
    return {
        date: props.transaction?.date || "",
        description: props.transaction?.description || "",
        transactionType: props.transaction?.transactionType || "",
        amount: props.transaction?.amount || 0,
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
        const { date, description, transactionType, amount } = this.state;

        this.props.onSave({
            _id: this.props.transaction?._id || null,
            date,
            description,
            transactionType,
            amount: parseFloat(amount),
        }, this.props.transactionIndex)
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
        const { date, description, transactionType, amount } = this.state;
        return (
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input type="text" className="form-control" name="date" value={date} onChange={this.handleChange} required />
                </div>
                <div className="mb-2">
                    <label className="form-label">Transaction Type</label>
                    <select className="form-select" name="transactionType" value={transactionType} onChange={this.handleChange} required>
                        <option value="DEBIT">Debit</option>
                        <option value="CREDIT">Credit</option>
                    </select>
                </div>
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
