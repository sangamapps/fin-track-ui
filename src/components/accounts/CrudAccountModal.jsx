"use strict";

import React from "react";
import Modal from "../Modal/Modal.jsx";

const ACCOUNT_GROUP = {
    bank: "Bank",
    cash: "Cash",
    credit_card: "Credit Card",
};

export default class CrudAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountGroup: props.account?.accountGroup || "",
            name: props.account?.name || "",
            amount: props.account?.amount || "",
            description: props.account?.description || "",
        };
        this.formRef = React.createRef();
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        console.log("handleSubmit called")
        e.preventDefault();
        const { accountGroup, name, amount, description } = this.state;

        this.props.onSave({
            id: this.props.account?.id || null,
            accountGroup,
            name,
            amount: parseFloat(amount),
            description,
        });
    };

    getModalTitle() {
        return this.props.account ? "Edit Account" : "Add Account";
    }

    onSubmitClick = () => {
        console.log("calledc")
        if (this.formRef.current) {
            this.formRef.current.requestSubmit();
        }
    }

    getModalBody() {
        const { accountGroup, name, amount, description } = this.state;
        return (
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Account Group</label>
                    <select className="form-control" name="accountGroup" value={accountGroup} onChange={this.handleChange} required>
                        <option></option>
                        {Object.keys(ACCOUNT_GROUP).map((key) => (
                            <option key={key} value={key}>{ACCOUNT_GROUP[key]}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} required />
                </div>
                <div className="mb-2">
                    <label className="form-label">Amount</label>
                    <input type="number" className="form-control" name="amount" value={amount} onChange={this.handleChange} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={description} onChange={this.handleChange}
                    ></textarea>
                </div>
            </form>
        );
    }

    render() {
        return <Modal show={this.props.show} title={this.getModalTitle()} body={this.getModalBody()} onClose={this.props.onClose} onSubmitClick={this.onSubmitClick} />;
    }
}
