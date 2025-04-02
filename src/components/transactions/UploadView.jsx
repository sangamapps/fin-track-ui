"use strict";

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { EXTRACTORS_MAP } from "@config";
import CrudAccountModal from "@components/accounts/CrudAccountModal.jsx";
import transactionService from "@services/transactionService";
import uiUtil from "@utils/uiUtil";

class Upload extends React.Component {
    state = {
        accountId: "",
        extractor: "",
        file: null,
        extractionStatus: false,
        extracted: 0,
        transactionsCount: 0,
        showAccountModal: false,
    };

    toggleAccountModal = (accountId = this.state.accountId) => {
        this.setState({ showAccountModal: !this.state.showAccountModal, accountId });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleFileUpload = async (e) => {
        const file = e.target.files[0];
        this.setState({ file: file, extracted: 0 });
    };

    getTransactions = (e) => {
        e.preventDefault();

        this.setState({ extractionStatus: true, extracted: 0 });
        transactionService.extract(this.state.accountId, this.state.extractor, this.state.file).then(data => {
            this.setState({ transactionsCount: data.transactionsCount, extractionStatus: false, extracted: 1 });
        }).catch(err => {
            this.setState({ extractionStatus: false, extracted: 0 });
            toast.error(err.message);
        });
    }

    getUploadCard() {
        const { accountId, extractor } = this.state;
        return <form className="p-3 shadow mb-3" onSubmit={this.getTransactions}>
            <h3 className="mb-3">Upload Statement</h3>
            <div className="mb-3">
                <label className="form-label">Select Account</label>
                <div className="d-flex">
                    <select className="form-select me-2" name="accountId" value={accountId} onChange={this.handleChange} required>
                        <option value=""></option>
                        {this.props.accounts.map((account, index) => (
                            <option key={index} value={account._id}>{account.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={() => this.toggleAccountModal()}>+</button>
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Select Extractor</label>
                <select className="form-select" name="extractor" value={extractor} onChange={this.handleChange} required>
                    <option value=""></option>
                    {_.keys(EXTRACTORS_MAP).map((extractor, index) => (
                        <option key={index} value={extractor}>{EXTRACTORS_MAP[extractor]}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <input type="file" className="form-control" onChange={this.handleFileUpload} required />
            </div>
            <div>
                <button className="btn btn-primary">Extract transactions</button>
            </div>
        </form>;
    }

    getResult() {
        const { extractionStatus, transactionsCount, extracted } = this.state;
        if (extractionStatus) {
            return uiUtil.spinnerLoader("mt-4");
        }
        if (extracted) {
            return <div className="mt-4 alert alert-success">
                <span>Extracted {transactionsCount} transactions. </span>
                {transactionsCount > 0 && <span>Visit <Link to="/transactions/drafts">Edit Drafts</Link> page to review and save draft transactions.</span>}
            </div>;
        }
        return;
    }

    getCrudRuleModal() {
        return <CrudAccountModal show={this.state.showAccountModal} onSave={(data) => this.toggleAccountModal(data.account._id)} onClose={() => this.toggleAccountModal()} />;
    }

    render() {
        return (
            <div className="mb-3">
                {this.getUploadCard()}
                {this.getCrudRuleModal()}
                {this.getResult()}
            </div>
        );
    }
}

export default connect(state => _.pick(state.user, ["accounts"]))(Upload);