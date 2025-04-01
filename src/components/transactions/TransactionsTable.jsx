"use strict";

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import transactionService from "@services/transactionService";
import SummaryTable from "./SummaryTable.jsx";
import { ACCOUNT_GROUP, TRANSACTION_COLUMNS_MAP, TRANSACTION_COLUMNS_LABEL_MAP, TRANSACTION_TYPES } from "@config";
import CrudRuleModal from "@components/rules/CrudRuleModal.jsx";
import CrudTransactionModal from "./CrudTransactionModal.jsx";
import ruleUtil from "@utils/ruleUtil"

const momentDate = (date) => {
    return moment(date, "YYYY-MM-DD");
}

class TransactionsTable extends React.Component {

    state = {
        ...this.getInitialFilters(),
        showRulesModal: false,
        showTransactionModal: false,
        selectedTransaction: null,
        transactions: [],
        transactionsLoading: true,
    }

    getInitialFilters() {
        return {
            startDateFilter: this.props.startDateFilter || "",
            endDateFilter: this.props.endDateFilter || "",
            accountGroupFilter: "",
            accountIdFilter: "",
            transactionTypeFilter: "",
            tagFilter: "",
        }
    }

    updateTransaction = (transaction) => {
        this.setState((prevState) => {
            const transactions = [...prevState.transactions];
            const index = _.findIndex(transactions, (a) => a._id === transaction._id);
            if (index >= 0) {
                transactions[index] = transaction;
            } else {
                transactions.push(transaction);
            }
            return { transactions, showTransactionModal: false, };
        });
    }

    deleteTransaction = (transaction) => {
        transactionService.delete(transaction._id).then((data) => {
            this.setState((prevState) => ({
                transactions: prevState.transactions.filter(t => t._id !== data._id)
            }), () => toast.info("Transaction deleted ✅"));
        });
    }

    toggleRulesModal = (selectedTransaction) => {
        this.setState({ showRulesModal: !this.state.showRulesModal, selectedTransaction });
    }

    handleRuleSave = (rule) => {
        this.toggleRulesModal();
    }

    getCrudRuleModal() {
        const { showRulesModal, selectedTransaction } = this.state;
        return <CrudRuleModal show={showRulesModal} rule={{ contains: selectedTransaction?.description }}
            onSave={this.handleRuleSave} onClose={() => this.toggleRulesModal()} />;
    }

    toggleTransactionModal = (selectedTransaction) => {
        this.setState({ showTransactionModal: !this.state.showTransactionModal, selectedTransaction });
    }

    getCrudTransactionModal() {
        const { showTransactionModal, selectedTransaction } = this.state;
        return <CrudTransactionModal show={showTransactionModal}
            transaction={selectedTransaction} onSave={this.updateTransaction} onClose={() => this.toggleTransactionModal()} />;
    }

    removeTransactionTag(transaction, rule_id) {
        transaction.appliedRules[rule_id] = 0;
        transactionService.upsert(transaction).then(this.updateTransaction);
    }

    getDefaultTag(tag, bg) {
        return <span className={"badge bg-" + bg + " mb-2 me-1"}>
            {tag}
        </span>
    }

    getTag(transaction, rule_id) {
        const { rulesMap } = this.props;
        return <div key={rule_id} className="badge bg-primary mb-2 me-1">
            {rulesMap[rule_id]?.tag}
            <span className="ms-1 cursor-pointer" onClick={() => this.removeTransactionTag(transaction, rule_id)}>
                &times;
            </span>
        </div>;
    }

    getTransactionTypeBg(transactionType) {
        return transactionType == TRANSACTION_TYPES.CREDIT ? "success" : "warning";
    }

    getTags(transaction) {
        const usedRules = _.keys(_.pickBy(transaction.appliedRules, v => v == 1));
        return <div className="d-flex ">
            <div className="d-flex flex-wrap">
                {this.getDefaultTag(transaction.transactionType, this.getTransactionTypeBg(transaction.transactionType))}
                {usedRules.length == 0 && this.getDefaultTag("Others", "dark")}
                {usedRules.map((rule_id) => this.getTag(transaction, rule_id))}
            </div>
            <div className="ms-auto d-flex flex-wrap justify-content-end">
                <span
                    className="badge bg-secondary mb-2 me-1 cursor-pointer"
                    onClick={() => this.toggleRulesModal(transaction)}
                >
                    +
                </span>
                <span className="badge bg-secondary cursor-pointer mb-2 me-1" onClick={() => this.toggleTransactionModal(transaction)}><i className="bi bi-pencil"></i></span>
                <span className="badge bg-danger cursor-pointer mb-2 me-1" onClick={() => this.deleteTransaction(transaction)}><i className="bi bi-trash"></i></span>
            </div>
        </div>;
    }

    getTransactionDate(transaction) {
        return <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.DATE]}:</strong> {momentDate(transaction[TRANSACTION_COLUMNS_MAP.DATE]).format("MMMM D, YYYY (dddd)")}
        </div>;
    }

    getTransactionAccountGroup(transaction) {
        const { accountsMap } = this.props;
        const accountId = transaction[TRANSACTION_COLUMNS_MAP.ACCOUNT_ID];
        return accountsMap && accountsMap[accountId] && <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.ACCOUNT_GROUP]}:</strong> {ACCOUNT_GROUP[accountsMap[accountId].accountGroup]}
        </div>;
    }

    getTransactionAccount(transaction) {
        const { accountsMap } = this.props;
        const accountId = transaction[TRANSACTION_COLUMNS_MAP.ACCOUNT_ID];
        return accountsMap && accountsMap[accountId] && <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.ACCOUNT_ID]}:</strong> {accountsMap[accountId].name}
        </div>;
    }

    getTransactionAmount(transaction) {
        return <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.AMOUNT]}: </strong>
            <span className={"badge bg-" + this.getTransactionTypeBg(transaction.transactionType)}>₹{transaction[TRANSACTION_COLUMNS_MAP.AMOUNT]}</span>
        </div>
    }

    getTransactionDescription(transaction) {
        return <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.DESCRIPTION]}:</strong> {transaction[TRANSACTION_COLUMNS_MAP.DESCRIPTION]}
        </div>;
    }

    getTransaction = (transaction, transactionIndex) => {
        if (!transaction) return;
        return <div key={transactionIndex} className="col-md-6 col-lg-4 mb-2">
            <div className="card shadow-sm">
                <div className="card-body">
                    {this.getTags(transaction)}
                    {this.getTransactionDate(transaction)}
                    {this.getTransactionAccountGroup(transaction)}
                    {this.getTransactionAccount(transaction)}
                    {this.getTransactionAmount(transaction)}
                    {this.getTransactionDescription(transaction)}
                </div>
            </div>
        </div>;
    }

    handleFilterChange = (e) => {
        const name = e.target.name;
        this.setState({ [name]: e.target.value }, () => {
            if (name == "startDateFilter" || name == "endDateFilter") {
                this.fetchTransactions();
            }
        });
    };

    getFilters() {
        const { accountsMap, rulesMap } = this.props;
        return <div className="p-3 shadow-lg bg-primary-subtle">
            <div className="row">
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">From</span>
                        <input type="date" name="startDateFilter" value={this.state.startDateFilter} className="form-control" onChange={this.handleFilterChange} />
                    </div>
                </div>
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">To</span>
                        <input type="date" name="endDateFilter" value={this.state.endDateFilter} className="form-control" onChange={this.handleFilterChange} />
                    </div>
                </div>
                {accountsMap && <div className="col-md-3 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Account Group</span>
                        <select name="accountGroupFilter" value={this.state.accountGroupFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            {_.keys(_.groupBy(this.props.accountsMap, "accountGroup")).map((accountGroup, index) => <option key={index} value={accountGroup}>{ACCOUNT_GROUP[accountGroup]}</option>)}
                        </select>
                    </div>
                </div>}
                {accountsMap && <div className="col-md-3 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Account</span>
                        <select name="accountIdFilter" value={this.state.accountIdFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            {_.values(this.props.accountsMap).map((account, index) => <option key={index} value={account._id}>{account.name} ({ACCOUNT_GROUP[account.accountGroup]})</option>)}
                        </select>
                    </div>
                </div>}
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Transaction Type</span>
                        <select name="transactionTypeFilter" value={this.state.transactionTypeFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            <option value={TRANSACTION_TYPES.DEBIT}>Debit</option>
                            <option value={TRANSACTION_TYPES.CREDIT}>Credit</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-3 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Tag</span>
                        <select name="tagFilter" value={this.state.tagFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            <option value={"__NONE__"}>Others</option>
                            {_.values(rulesMap).map((rule, index) => <option key={index} value={rule._id}>{rule.tag}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => this.setState(this.getInitialFilters())}>Reset filters</button>
        </div>;
    }

    getTransactions(transactions) {
        const { transactionsLoading } = this.state;

        if (transactionsLoading) {
            return <div className="mt-4 d-flex justify-content-center">
                <div className="spinner-border text-primary text-center" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>;
        }

        if (this.state.transactions.length == 0) {
            return <div className="mt-4 d-flex justify-content-center">
                <span className="text-muted">No transactions found. {this.props.bulkSave && <span>Visit <Link to="/transactions">views</Link> page to see the saved transactions.</span>}</span>
            </div>;
        }

        if (transactions.length == 0) {
            return <div className="mt-4 d-flex justify-content-center">
                <span className="text-muted">No transactions found for applied filters.</span>
            </div>;
        }

        return <div className="row">{transactions.map(this.getTransaction)}</div>;
    }

    getAddButton() {
        return <button
            className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
            onClick={() => this.toggleTransactionModal()}
            style={{ width: "50px", height: "50px" }}
        >+</button>;
    }

    getFilteredTransactions() {
        return _.filter(this.state.transactions, (transaction) => {
            if (!_.isEmpty(this.state.accountGroupFilter) && this.props.accountsMap[transaction.accountId].accountGroup != this.state.accountGroupFilter) return false;
            if (!_.isEmpty(this.state.accountIdFilter) && transaction.accountId != this.state.accountIdFilter) return false;
            if (!_.isEmpty(this.state.transactionTypeFilter) && transaction.transactionType != this.state.transactionTypeFilter) return false;
            ruleUtil.applyRules(transaction, this.props.rules);
            if (!_.isEmpty(this.state.tagFilter)) {
                if (this.state.tagFilter == "__NONE__" && _.size(_.pickBy(transaction.appliedRules, v => v == 1)) == 0) return transaction;
                if (this.state.tagFilter in transaction.appliedRules && transaction.appliedRules[this.state.tagFilter] == 1) return transaction;
                return false;
            }
            return true;
        });
    }

    getLoader() {
        const { transactionsLoading } = this.state;
        return transactionsLoading && <div className="mt-4 d-flex justify-content-center">
            <div className="spinner-border text-primary text-center" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    bulkSave = () => {
        transactionService.bulkSave().then(() => {
            toast.info("Transactions saved ✅")
            this.setState({ transactions: [] });
        });
    }

    getBulkSaveButton() {
        return this.props.bulkSave && this.state.transactions.length > 0 && <div className="d-flex justify-content-center">
            <button className="btn btn-primary" onClick={this.bulkSave}>Save transactions</button>
        </div>;
    }

    render() {
        const transactions = this.getFilteredTransactions();
        return (
            <div className="mb-2">
                {this.getFilters()}
                <SummaryTable transactions={transactions} />
                {this.getTransactions(transactions)}
                {this.getBulkSaveButton()}
                {this.getAddButton()}
                {this.getCrudRuleModal()}
                {this.getCrudTransactionModal()}
            </div>
        );
    }

    fetchTransactions() {
        transactionService.getAll(this.state.startDateFilter, this.state.endDateFilter, this.props.isDraft).then(data => {
            this.setState({ transactions: data.transactions, transactionsLoading: false });
        });
    }

    componentDidMount() {
        this.fetchTransactions();
    }
}

export default connect(state => _.pick(state.user, ["accountsMap", "rules", "rulesMap"]))(TransactionsTable);