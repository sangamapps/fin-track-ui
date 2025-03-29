"use strict";

import React from "react";
import CrudAccountModal from "./CrudAccountModal.jsx";
import Account from "./Accounts.js"

export default class Accounts extends React.Component {
    state = {
        accounts: [],
        selectedAccount: null,
        showModal: false,
    };

    toggleModal = (account = null) => {
        this.setState({ showModal: !this.state.showModal, selectedAccount: account });
    };

    handleSave = (account) => {
        Account.upsert(account).then(data => console.log(data));
    };

    handleDelete = (id) => {
        Account.delete()
    };

    render() {
        const { accounts, showModal, selectedAccount } = this.state;

        const groupedAccounts = accounts.reduce((groups, account) => {
            if (!groups[account.accountGroup]) {
                groups[account.accountGroup] = [];
            }
            groups[account.accountGroup].push(account);
            return groups;
        }, {});

        return (
            <div className="container mt-3">
                <h1>Accounts</h1>

                <button
                    className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
                    onClick={() => this.toggleModal()}
                    style={{ width: "50px", height: "50px" }}
                >+</button>

                {Object.keys(groupedAccounts).map((group) => (
                    <div key={group} className="mt-3">
                        <h3>{group}</h3>
                        <ul className="list-group">
                            {groupedAccounts[group].map((acc) => (
                                <li
                                    key={acc.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{acc.name}</strong>
                                        <p className="mb-0 text-muted">{acc.description}</p>
                                    </div>
                                    <div>
                                        <span className="badge bg-success me-2">₹{acc.amount}</span>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => this.toggleModal(acc)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => this.handleDelete(acc.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {<CrudAccountModal show={showModal} account={selectedAccount} onSave={this.handleSave} onClose={()=>this.toggleModal()}/>}
            </div>
        );
    }
}
