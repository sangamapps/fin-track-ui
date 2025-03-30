"use strict";

import React from "react";
import SummaryTable from "./SummaryTable.jsx";
import { TRANSACTION_COLUMNS, TRANSACTION_COLUMNS_MAP } from "@config";
import accountService from "@services/accountService";
import ruleService from "@services/ruleService";
import CrudRuleModal from "@components/rules/CrudRuleModal.jsx";
import CrudTransactionModal from "./CrudTransactionModal.jsx";
import transactionService from "@services/transactionService.js";

export default class TransactionsTable extends React.Component {

    state = {
        filteredTransactions: [],
        startDateFilter: null,
        endDateFilter: null,
        transactionTypeFilter: null,
        tagFilter: null,
        showRulesModal: false,
        showTransactionModal: false,
        selectedTransactionIndex: null,
        getAccountsLoadingStatus: false,
        accounts: [],
        getRulesLoadingStatus: false,
        rulesMap: {},
        selectedAccount: "",
    }

    applyRules = (transactions, rules) => {
        transactions.forEach((transaction) => {
            rules.forEach(rule => {
                const { _id, contains } = rule;
                if (_id in transaction.appliedRules) return;
                if (transaction.description.toLowerCase().includes(contains.toLowerCase())) {
                    transaction.appliedRules[_id] = 1;
                }
            });
        });
        return transactions;
    };

    updateTransaction = (transaction, transactionIndex) => {
        this.props.transactions[transactionIndex] = _.assign(this.props.transactions[transactionIndex], transaction);
        this.applyRules([this.props.transactions[transactionIndex]], _.values(this.state.rulesMap));
        this.forceUpdate();
    }

    updateRule = (rule) => {
        this.state.rulesMap[rule._id] = rule;
        this.applyRules(this.props.transactions, [rule]);
        this.forceUpdate();
    }

    toggleRulesModal = (selectedTransactionIndex) => {
        this.setState({ showRulesModal: !this.state.showRulesModal, selectedTransactionIndex });
    }

    handleRuleSave = (rule) => {
        this.toggleRulesModal();
        this.updateRule(rule);
    }

    getCrudRuleModal() {
        const { showRulesModal, selectedTransactionIndex } = this.state;
        const contains = selectedTransactionIndex >= 0 ? this.props.transactions[selectedTransactionIndex]?.description : "";
        return <CrudRuleModal show={showRulesModal} rule={{ contains }}
            onSave={this.handleRuleSave} onClose={() => this.toggleRulesModal()} />;
    }

    toggleTransactionModal = (selectedTransactionIndex) => {
        this.setState({ showTransactionModal: !this.state.showTransactionModal, selectedTransactionIndex });
    }

    handleTransactionSave = (transaction, transactionIndex) => {
        this.toggleTransactionModal();
        this.updateTransaction(transaction, transactionIndex);
    }

    getCrudTransactionModal() {
        const { showTransactionModal, selectedTransactionIndex } = this.state;
        const selectedTransaction = selectedTransactionIndex >= 0 ? this.props.transactions[selectedTransactionIndex] : null;
        return <CrudTransactionModal show={showTransactionModal}
            transaction={selectedTransaction} transactionIndex={selectedTransactionIndex}
            onSave={this.handleTransactionSave} onClose={() => this.toggleTransactionModal()} />;
    }

    removeTransactionTag(transaction, transactionIndex, rule_id) {
        transaction.appliedRules[rule_id] = 0;
        this.updateTransaction(transaction, transactionIndex);
    }

    getDefaultTag(tag, bg) {
        return <span className={"badge bg-" + bg + " me-1"}>
            {tag}
        </span>
    }

    getTag(transaction, transactionIndex, rule_id) {
        const { rulesMap } = this.state;
        return <div key={rule_id} className="badge bg-primary me-1">
            {rulesMap[rule_id]?.tag}
            <span className="ms-1 cursor-pointer" onClick={() => this.removeTransactionTag(transaction, transactionIndex, rule_id)}>
                &times;
            </span>
        </div>;
    }

    getTags(transaction, transactionIndex) {
        const usedRules = _.keys(_.pickBy(transaction.appliedRules, v => v == 1));
        return <div className="row mb-2">
            <div className="col-8">
                {this.getDefaultTag(transaction.transactionType, transaction.transactionType == "CREDIT" ? "success" : "warning")}
                {usedRules.length == 0 && this.getDefaultTag("Others", "dark")}
                {usedRules.map((rule_id) => this.getTag(transaction, transactionIndex, rule_id))}
                <span
                    className="badge bg-secondary me-2 cursor-pointer"
                    onClick={() => this.toggleRulesModal(transactionIndex)}
                >
                    +
                </span>
            </div>
            <div className="col-3">
                {this.getTransactionActions(transactionIndex)}
            </div>
        </div>;
    }

    getTransactionActions(transactionIndex) {
        return <div className="d-flex">
            <span className="badge bg-warning cursor-pointer me-2" onClick={() => this.toggleTransactionModal(transactionIndex)}><i className="bi bi-pencil"></i></span>
            <span className="badge bg-danger cursor-pointer"><i className="bi bi-trash"></i></span>
        </div>
            ;
    }

    getTransaction = (transaction, transactionIndex) => {
        if (!transaction) return;
        return <div key={transactionIndex} className="col-md-6 col-lg-4 mb-2">
            <div className="card shadow">
                <div className="card-body">
                    {this.getTags(transaction, transactionIndex)}
                    {TRANSACTION_COLUMNS.map((key) => (
                        <div key={key} className="mb-1">
                            <strong>{TRANSACTION_COLUMNS_MAP[key]}:</strong> {transaction[key]}
                        </div>
                    ))}
                </div>
            </div>
        </div>;
    }

    getTransactions() {
        const { transactions } = this.props;
        return <div className="row">{transactions.map(this.getTransaction)}</div>;
    }

    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    getFilters() {
        const { rulesMap } = this.state;
        return <div className="card p-3 shadow">
            <div className="row">
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="fw-bold">From</div>
                    <input type="date" name="startDateFilter" className="form-control" onChange={this.handleFilterChange} />
                </div>
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="fw-bold">To</div>
                    <input type="date" name="endDateFilter" className="form-control" onChange={this.handleFilterChange} />
                </div>
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="fw-bold">Transaction Type</div>
                    <select name="transactionTypeFilter" className="form-control" onChange={this.handleFilterChange}>
                        <option value="">All</option>
                        <option value={"DEBIT"}>Debit</option>
                        <option value={"CREDIT"}>Credit</option>
                    </select>
                </div>
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="fw-bold">Tag</div>
                    <select name="tagFilter" className="form-control" onChange={this.handleFilterChange}>
                        <option value="">All</option>
                        <option value={"__NONE__"}>Others</option>
                        {_.values(rulesMap).map((rule, index) => <option key={index} value={rule._id}>{rule.tag}</option>)}
                    </select>
                </div>
            </div>
        </div>;
    }

    getFilteredTransactions() {
        return _.map(this.props.transactions, (transaction) => {
            if (!_.isEmpty(this.state.startDateFilter) && transaction.date <= this.state.startDateFilter) return null;
            if (!_.isEmpty(this.state.endDateFilter) && transaction.date >= this.state.endDateFilter) return null;
            if (!_.isEmpty(this.state.transactionTypeFilter) && transaction.transactionType != this.state.transactionTypeFilter) return null;
            if (!_.isEmpty(this.state.tagFilter)) {
                if (this.state.tagFilter == "__NONE__" && _.size(_.pickBy(transaction.appliedRules, v => v == 1)) == 0) return transaction;
                if (this.state.tagFilter in transaction.appliedRules && transaction.appliedRules[this.state.tagFilter] == 1) return transaction;
                return null;
            }
            return transaction;
        });
    }

    handleAccountChange = (e) => {
        this.setState({ selectedAccount: e.target.value });
    }

    bulkSave = () => {
        this.props.transactions.forEach((transaction) => {
            transaction.account = this.state.selectedAccount;
        });
        transactionService.bulkSave(this.props.transactions);
    }

    getBulkSaveCard() {
        return <div className="card p-3 shadow-lg">
            <div className="mb-3">
                <select className="form-select" value={this.state.selectedAccount} onChange={this.handleAccountChange}>
                    <option value="">Select Account</option>
                    {this.state.accounts.map((account, index) => (
                        <option key={index} value={account._id}>{account.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <button className="btn btn-primary" disabled={_.isEmpty(this.state.selectedAccount) || _.isEmpty(this.props.transactions)} onClick={this.bulkSave}>Bulk Save</button>
            </div>
        </div>;
    }

    render() {
        const filteredTransactions = this.getFilteredTransactions();
        return (
            <div className="mt-4 overflow-auto">
                {this.getFilters()}
                <SummaryTable transactions={filteredTransactions} />
                <div className="row">{filteredTransactions.map(this.getTransaction)}</div>
                {this.getCrudRuleModal()}
                {this.getCrudTransactionModal()}
                {this.props.bulkSave && this.getBulkSaveCard()}
            </div>
        );
    }

    getAccounts = () => {
        this.setState({ getAccountsLoadingStatus: true }, () => {
            accountService.getAll().then(data => {
                this.setState({ getAccountsLoadingStatus: false, accounts: data.accounts });
            });
        });
    }

    getRules = () => {
        this.setState({ getRulesLoadingStatus: true }, () => {
            ruleService.getAll().then(data => {
                this.setState({
                    getRulesLoadingStatus: false,
                    rulesMap: _.mapValues(_.keyBy(data.rules, '_id')),
                    transactions: this.applyRules(this.props.transactions, data.rules)
                });
            });
        });
    }

    componentDidMount() {
        this.getAccounts();
        this.getRules();
    }
}