"use strict";

import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import transactionService from "@services/transactionService";
import SummaryTable from "./SummaryTable.jsx";
import { ACCOUNT_GROUP, TRANSACTION_COLUMNS_MAP, TRANSACTION_COLUMNS_LABEL_MAP, TRANSACTION_TYPES } from "@config";
import CrudRuleModal from "@components/rules/CrudRuleModal.jsx";
import CrudTransactionModal from "./CrudTransactionModal.jsx";
import StatsView from "./stats/StatsView.jsx";

const momentDate = (date) => {
    return moment(date, "YYYY-MM-DD");
}

class TransactionsView extends React.Component {

    state = {
        showRulesModal: false,
        showTransactionModal: false,
        selectedTransaction: null,
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
            transaction={selectedTransaction} onSave={this.props.updateTransaction} isDraft={this.props.isDraft} onClose={() => this.toggleTransactionModal()} />;
    }

    removeTransactionTag(transaction, rule_id) {
        transaction.appliedRules[rule_id] = 0;
        transactionService.upsert(transaction).then(this.props.updateTransaction);
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
                {usedRules.length == 0 && this.getDefaultTag("Others", "danger")}
                {usedRules.map((rule_id) => this.getTag(transaction, rule_id))}
            </div>
            <div className="ms-auto d-flex flex-wrap justify-content-end">
                <span
                    className="badge bg-dark mb-2 me-1 cursor-pointer"
                    onClick={() => this.toggleRulesModal(transaction)}
                >
                    +
                </span>
                <span className="badge bg-dark cursor-pointer mb-2 me-1" onClick={() => this.toggleTransactionModal(transaction)}><i className="bi bi-pencil"></i></span>
                <span className="badge bg-dark cursor-pointer mb-2 me-1" onClick={() => this.props.deleteTransaction(transaction)}><i className="bi bi-trash"></i></span>
            </div>
        </div>;
    }

    getTransactionDate(transaction) {
        return <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.DATE]}:</strong> {momentDate(transaction[TRANSACTION_COLUMNS_MAP.DATE]).format("MMMM D, YYYY (dddd)")}
        </div>;
    }

    getTransactionAccountGroup(transaction) {
        return transaction.accountGroup && <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.ACCOUNT_GROUP]}:</strong> {transaction.accountGroup}
        </div>;
    }

    getTransactionAccount(transaction) {
        return transaction.accountGroup && <div className="mb-1">
            <strong>{TRANSACTION_COLUMNS_LABEL_MAP[TRANSACTION_COLUMNS_MAP.ACCOUNT_ID]}:</strong> {transaction.accountName}
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

    getTransactionsCountLabel(filteredTransactions) {
        return <div className="d-flex justify-content-center">
            <span className="text-muted">Showing {filteredTransactions.length} of {this.props.transactions.length} transactions.</span>
        </div>;
    }

    getDraftActions(filteredTransactions) {
        // const isFiltered = filteredTransactions.length < this.props.transactions.length;
        return this.props.isDraft && this.props.transactions.length > 0 && <div className="mt-2 d-flex justify-content-center">
            <button className="btn btn-primary me-2" onClick={this.saveDrafts}>Save All</button>
            <button className="btn btn-danger" onClick={this.deleteDrafts}>Delete All</button>
        </div>;
    }

    getTransactions(filteredTransactions) {
        return this.props.transactions.length > 0 && <div>
            <StatsView filteredTransactions={filteredTransactions} />
            <SummaryTable transactions={filteredTransactions} />
            {this.getTransactionsCountLabel(filteredTransactions)}
            {this.getDraftActions(filteredTransactions)}
            <div className="row mt-2">{filteredTransactions.slice().reverse().map(this.getTransaction)}</div>
            {this.getDraftActions(filteredTransactions)}
        </div>;
    }

    getAddButton() {
        return <button
            className="btn btn-dark rounded-circle position-fixed bottom-0 end-0 m-2"
            onClick={() => this.toggleTransactionModal()}
            style={{ width: "50px", height: "50px" }}
        ><i class="bi bi-database-fill-add"></i></button>;
    }

    saveDrafts = () => {
        transactionService.saveDrafts().then(() => {
            toast.info("Draft transactions saved ✅");
            this.props.fetchTransactions();
        });
    }

    deleteDrafts = () => {
        transactionService.deleteDrafts().then(() => {
            toast.info("Draft transactions deleted ✅");
            this.props.fetchTransactions();
        });
    }

    render() {
        const filteredTransactions = this.props.filteredTransactions;
        return (
            <div className="mb-2">
                {this.getTransactions(filteredTransactions)}
                {this.getAddButton()}
                {this.getCrudRuleModal()}
                {this.getCrudTransactionModal()}
            </div>
        );
    }
}

export default connect(state => _.pick(state.user, ["accountsMap", "rulesMap"]))(TransactionsView);