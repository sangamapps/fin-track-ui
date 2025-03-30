"use strict";

import React from "react";
import { ACCOUNT_GROUP } from "@config";
import CrudAccountModal from "./CrudAccountModal.jsx";
import accountService from "@services/accountService";

export default class Accounts extends React.Component {
    state = {
        getAccountsLoadingStatus: true,
        accounts: [],
        selectedAccount: null,
        showModal: false,
    };

    toggleModal = (selectedAccount = null) => {
        return new Promise((resolve) => {
            this.setState({ showModal: !this.state.showModal, selectedAccount }, resolve);
        });
    };

    handleSave = (account) => {
        const existingAccount = _.find(this.state.accounts, { _id: account._id });
        if (existingAccount) {
            _.assign(existingAccount, account);
        } else {
            this.state.accounts.push(account);
        }
        this.toggleModal();
    };

    handleDelete = (id) => {
        accountService.delete(id).then(this.getAccounts);
    };

    getAccountsContainer() {
        const { accounts } = this.state;

        if (accounts.length === 0) {
            if (this.state.getAccountsLoadingStatus) {
                return <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>;
            }
            return <div className="alert alert-info" role="alert">No accounts found</div>;
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
        return <CrudAccountModal show={this.state.showModal} account={this.state.selectedAccount} onSave={this.handleSave} onClose={() => this.toggleModal()} />;
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

    getAccounts = () => {
        accountService.getAll().then(data => {
            this.setState({ getAccountsLoadingStatus: false, accounts: data.accounts });
        });
    }

    componentDidMount() {
        this.getAccounts();
    }
}
