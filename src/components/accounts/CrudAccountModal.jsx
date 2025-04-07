"use strict";

import React from "react";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import Modal from "@modal/Modal.jsx";
import { upsertAccountRequest } from "@store";
import { ACCOUNT_GROUP } from "@config";

function getDerivedStateFromProps(props) {
    return {
        _id: props.account?._id || "",
        accountGroup: props.account?.accountGroup || "",
        name: props.account?.name || "",
        amount: props.account?.amount || "",
        description: props.account?.description || "",
        comments: props.account?.comments || "",
    };
}

class CrudAccountModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = getDerivedStateFromProps(props);
        this.formRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.account !== this.props.account) {
            this.setState(getDerivedStateFromProps(this.props));
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.dispatch(upsertAccountRequest(this.state)).then(data => {
            toast.info("Account saved ✅");
            const onSave = this.props.onSave || this.props.onClose || (() => { });
            onSave(data.payload);
        });
    };

    getModalTitle() {
        return this.props.account ? "Edit Account" : "Add Account";
    }

    onSubmitClick = () => {
        if (this.formRef.current) {
            this.formRef.current.requestSubmit();
        }
    }

    getModalBody() {
        const { accountGroup, name, amount, description, comments } = this.state;
        return (
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Account Group</label>
                    <select className="form-control" name="accountGroup" value={accountGroup} onChange={this.handleChange} required>
                        <option></option>
                        {_.keys(ACCOUNT_GROUP).map((key, index) => (
                            <option key={index} value={key}>{ACCOUNT_GROUP[key]}</option>
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
                    <textarea className="form-control" name="description" value={description} onChange={this.handleChange} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Comments</label>
                    <textarea className="form-control" name="comments" value={comments} onChange={this.handleChange} />
                </div>
            </form>
        );
    }

    render() {
        return <Modal show={this.props.show} title={this.getModalTitle()} body={this.getModalBody()} onClose={this.props.onClose} onSubmitClick={this.onSubmitClick} />;
    }
}

export default connect()(CrudAccountModal);