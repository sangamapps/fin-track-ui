"use strict";

import React from "react";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import CrudAccountModal from "./CrudAccountModal.jsx";
import { deleteAccountRequest } from "@store";
import { ACCOUNT_GROUP } from "@config";

class Accounts extends React.Component {
    state = {
        selectedAccount: null,
        showModal: false,
    };

    toggleModal = (selectedAccount = null) => {
        this.setState({ showModal: !this.state.showModal, selectedAccount });
    };

    handleDelete = (_id) => {
        this.props.dispatch(deleteAccountRequest(_id)).then(() => {
            toast.info("Account deleted ✅");
        });
    };

    getAccountsContainer() {
        const { accounts, loadingAccounts } = this.props;

        if (loadingAccounts) {
            return <div className="mt-4 spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>;
        }

        if (accounts.length === 0) {
            return <div className="mt-4">
                <span className="text-muted">No accounts found.</span>
            </div>;
        }

        const groupedAccounts = _.groupBy(accounts, "accountGroup");

        return _.keys(groupedAccounts).map((group) => (
            <div key={group} className="mt-3">
                <h3>{ACCOUNT_GROUP[group]}</h3>
                <ul className="list-group">
                    {groupedAccounts[group].map((acc) => (
                        <li
                            key={acc._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{acc.name}</strong>
                                <p className="mb-0 text-muted">{acc.description}</p>
                            </div>
                            <div>
                                <span className="badge bg-success me-2">₹{acc.amount}</span>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => this.toggleModal(acc)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => this.handleDelete(acc._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        ));
    }

    getCrudAccountModal() {
        return <CrudAccountModal show={this.state.showModal} account={this.state.selectedAccount} onClose={() => this.toggleModal()} />;
    }

    getAddButton() {
        return <button
            className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
            onClick={() => this.toggleModal()}
            style={{ width: "50px", height: "50px" }}
        >+</button>;
    }

    render() {
        return (
            <div className="container mt-3">
                <h1>Accounts</h1>
                {this.getAccountsContainer()}
                {this.getCrudAccountModal()}
                {this.getAddButton()}
            </div>
        );
    }
}

export default connect(state => _.pick(state.user, ["accounts", "loadingAccounts"]))(Accounts);