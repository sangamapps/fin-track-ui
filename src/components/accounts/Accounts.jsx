"use strict";

import React from "react";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import CrudAccountModal from "./CrudAccountModal.jsx";
import { deleteAccountRequest } from "@store";
import { ACCOUNT_GROUP } from "@config";
import uiUtil from "@utils/uiUtil.js";
import amountUtil from "@utils/amountUtil.js";

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
            return uiUtil.spinnerLoader("mt-4");
        }

        if (accounts.length === 0) {
            return <div className="mt-4">
                <span className="text-muted">No accounts found.</span>
            </div>;
        }

        const groupedAccounts = _.groupBy(accounts, "accountGroup");

        return _.keys(groupedAccounts).map((group) => {
            const closingBalance = groupedAccounts[group].reduce((sum, acc) => sum + parseFloat(acc.currentBalance || 0), 0);

            return (
                <div key={group} className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mb-0">{ACCOUNT_GROUP[group]}</h3>
                        <span className="badge bg-primary">
                            Closing Balance: ₹{amountUtil.getFormattedAmount(closingBalance)}
                        </span>
                    </div>
                    <ul className="list-group mt-2">
                        {groupedAccounts[group].map((acc) => (
                            <li key={acc._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{acc.name}</strong>
                                    <p className="mb-0 text-muted">{acc.description}</p>
                                    <div className="text-muted d-block mt-1 fs-6">
                                        <div>
                                            Opening Balance:
                                            <span>₹{amountUtil.getParsedAmount(acc.amount)}</span>
                                        </div>
                                        <div>
                                            Total Credit:{" "}
                                            <span className="text-success">₹{amountUtil.getParsedAmount(acc.totalCredit)}</span>
                                        </div>
                                        <div>
                                            Total Debit:{" "}
                                            <span className="text-danger">₹{amountUtil.getParsedAmount(acc.totalDebit)}</span>
                                        </div>
                                        <div>
                                            Closing Balance:{" "}
                                            <strong>₹{amountUtil.getParsedAmount(acc.currentBalance)}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => this.toggleModal(acc)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => this.handleDelete(acc._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        });

    }

    getCrudAccountModal() {
        return <CrudAccountModal show={this.state.showModal} account={this.state.selectedAccount} onClose={() => this.toggleModal()} />;
    }

    getAddButton() {
        return <button
            className="btn btn-dark rounded-circle position-fixed bottom-0 end-0 m-4"
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