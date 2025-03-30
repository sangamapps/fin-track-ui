"use strict";

import React from "react";
import SummaryTable from "./SummaryTable.jsx";
import { TRANSACTION_COLUMNS_MAP, TRANSACTION_COLUMN_DATE, TRANSACTION_COLUMN_AMOUNT, TRANSACTION_COLUMN_DESCRIPTION } from "@config";
import ruleService from "@services/ruleService";
import CrudRuleModal from "@components/rules/CrudRuleModal.jsx";
import CrudTransactionModal from "./CrudTransactionModal.jsx";

const momentDate = (date) => {
    return moment(date, "YYYY-MM-DD");
}

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
        rulesMap: {},
    }

    applyRules = (transactions, rules) => {
        transactions.forEach((transaction) => {
            rules.forEach(rule => {
                const { _id, contains } = rule;
                if (_id in transaction.appliedRules) return;
                const description = _.lowerCase(transaction.description);
                const keywords = _.split(_.lowerCase(contains), ",");
                if (_.some(keywords, (word) => description.includes(word))) {
                    transaction.appliedRules[_id] = 1;
                }
            });
        });
        return transactions;
    };

    updateTransaction = (transaction, transactionIndex) => {
        this.props.updateTransaction(transaction, transactionIndex);
        this.applyRules([this.props.transactions[transactionIndex]], _.values(this.state.rulesMap));
        this.forceUpdate();
    }

    deleteTransaction = (transaction, transactionIndex) => {
        this.props.deleteTransaction(transaction, transactionIndex);
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
        return <span className={"badge bg-" + bg + " mb-2 me-1"}>
            {tag}
        </span>
    }

    getTag(transaction, transactionIndex, rule_id) {
        const { rulesMap } = this.state;
        return <div key={rule_id} className="badge bg-primary mb-2 me-1">
            {rulesMap[rule_id]?.tag}
            <span className="ms-1 cursor-pointer" onClick={() => this.removeTransactionTag(transaction, transactionIndex, rule_id)}>
                &times;
            </span>
        </div>;
    }

    getTransactionTypeBg(transactionType) {
        return transactionType == "CREDIT" ? "success" : "warning";
    }

    getTags(transaction, transactionIndex) {
        const usedRules = _.keys(_.pickBy(transaction.appliedRules, v => v == 1));
        return <div className="d-flex ">
            <div className="d-flex flex-wrap">
                {this.getDefaultTag(transaction.transactionType, this.getTransactionTypeBg(transaction.transactionType))}
                {usedRules.length == 0 && this.getDefaultTag("Others", "dark")}
                {usedRules.map((rule_id) => this.getTag(transaction, transactionIndex, rule_id))}
            </div>
            <div className="ms-auto d-flex flex-wrap justify-content-end">
                <span
                    className="badge bg-secondary mb-2 me-1 cursor-pointer"
                    onClick={() => this.toggleRulesModal(transactionIndex)}
                >
                    +
                </span>
                <span className="badge bg-secondary cursor-pointer mb-2 me-1" onClick={() => this.toggleTransactionModal(transactionIndex)}><i className="bi bi-pencil"></i></span>
                <span className="badge bg-danger cursor-pointer mb-2 me-1" onClick={() => this.deleteTransaction(transaction, transactionIndex)}><i className="bi bi-trash"></i></span>
            </div>
        </div>;
    }

    getTransaction = (transaction, transactionIndex) => {
        if (!transaction) return;
        return <div key={transactionIndex} className="col-md-6 col-lg-4 mb-2">
            <div className="card shadow-sm">
                <div className="card-body">
                    {this.getTags(transaction, transactionIndex)}
                    <div className="mb-1">
                        <strong>{TRANSACTION_COLUMNS_MAP[TRANSACTION_COLUMN_DATE]}:</strong> {momentDate(transaction[TRANSACTION_COLUMN_DATE]).format("MMMM D, YYYY (dddd)")}
                    </div>
                    <div className="mb-1">
                        <strong>{TRANSACTION_COLUMNS_MAP[TRANSACTION_COLUMN_AMOUNT]}:</strong>
                        <span className={"badge bg-" + this.getTransactionTypeBg(transaction.transactionType)}>₹{transaction[TRANSACTION_COLUMN_AMOUNT]}</span>
                    </div>
                    <div className="mb-1">
                        <strong>{TRANSACTION_COLUMNS_MAP[TRANSACTION_COLUMN_DESCRIPTION]}:</strong> {[TRANSACTION_COLUMN_DESCRIPTION]}
                    </div>
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
        return <div className="p-3 shadow-lg">
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
            const transactionDate = momentDate(transaction.date);
            if (!_.isEmpty(this.state.startDateFilter) && transactionDate.isBefore(momentDate(this.state.startDateFilter))) return null;
            if (!_.isEmpty(this.state.endDateFilter) && transactionDate.isAfter(momentDate(this.state.endDateFilter))) return null;
            if (!_.isEmpty(this.state.transactionTypeFilter) && transaction.transactionType != this.state.transactionTypeFilter) return null;
            if (!_.isEmpty(this.state.tagFilter)) {
                if (this.state.tagFilter == "__NONE__" && _.size(_.pickBy(transaction.appliedRules, v => v == 1)) == 0) return transaction;
                if (this.state.tagFilter in transaction.appliedRules && transaction.appliedRules[this.state.tagFilter] == 1) return transaction;
                return null;
            }
            return transaction;
        });
    }

    render() {
        const filteredTransactions = this.getFilteredTransactions();
        return (
            <div className="mb-3">
                {this.getFilters()}
                <SummaryTable transactions={filteredTransactions} />
                <div className="row">{filteredTransactions.map(this.getTransaction)}</div>
                {this.getCrudRuleModal()}
                {this.getCrudTransactionModal()}
            </div>
        );
    }

    getRules = () => {
        ruleService.getAll().then(data => {
            this.applyRules(this.props.transactions, data.rules);
            this.setState({ rulesMap: _.mapValues(_.keyBy(data.rules, '_id')) });
        });
    }

    componentDidMount() {
        this.getRules();
    }
}