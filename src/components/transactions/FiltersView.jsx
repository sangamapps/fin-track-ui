"use strict";

import React from "react";
import { connect } from "react-redux";
import { ACCOUNT_GROUP, TRANSACTION_TYPES } from "@config";

class FiltersView extends React.Component {

    state = {
        showFiltersView: false,
    }

    toggleFiltersView() {
        this.setState({ showFiltersView: !this.state.showFiltersView });
    }

    handleFilterChange = (e) => {
        this.props.handleFilterChange(e.target.name, e.target.value);
    };

    getDateFilter = () => {
        const { filters } = this.props;
        return <div className="mb-2">
            <div className="input-group m-0">
                <span className="input-group-text">From</span>
                <input type="date" name="startDateFilter" value={filters.startDateFilter} className="form-control" onChange={this.handleFilterChange} />
                <span className="input-group-text">To</span>
                <input type="date" name="endDateFilter" value={filters.endDateFilter} className="form-control" onChange={this.handleFilterChange} />
                <button className="btn btn-dark" onClick={() => this.props.resetDateFilter("startDateFilter", "")}>
                    <i className="bi bi-trash-fill"></i>
                </button>
            </div>
        </div>
    }

    getFilters() {
        if (!this.state.showFiltersView) return this.getFiltersButton();
        const { accountsMap, rulesMap, filters } = this.props;
        return <div className="p-3 bg-dark-subtle">
            <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Min</span>
                        <input type="number" name="minAmountFilter" value={filters.minAmountFilter} className="form-control" onChange={this.handleFilterChange} />
                        <span className="input-group-text">Max</span>
                        <input type="number" name="maxAmountFilter" value={filters.maxAmountFilter} className="form-control" onChange={this.handleFilterChange} />
                    </div>
                </div>
                {accountsMap && <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Account Group</span>
                        <select name="accountGroupFilter" value={filters.accountGroupFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            {_.keys(_.groupBy(this.props.accountsMap, "accountGroup")).map((accountGroup, index) => <option key={index} value={accountGroup}>{ACCOUNT_GROUP[accountGroup]}</option>)}
                        </select>
                    </div>
                </div>}
                {accountsMap && <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Account</span>
                        <select name="accountIdFilter" value={filters.accountIdFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            {_.values(this.props.accountsMap).map((account, index) => <option key={index} value={account._id}>{account.name} ({ACCOUNT_GROUP[account.accountGroup]})</option>)}
                        </select>
                    </div>
                </div>}
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Transaction Type</span>
                        <select name="transactionTypeFilter" value={filters.transactionTypeFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            <option value={TRANSACTION_TYPES.DEBIT}>Debit</option>
                            <option value={TRANSACTION_TYPES.CREDIT}>Credit</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Tag</span>
                        <select name="tagFilter" value={filters.tagFilter} className="form-control" onChange={this.handleFilterChange}>
                            <option value="">All</option>
                            <option value={"__NONE__"}>Others</option>
                            {_.values(rulesMap).map((rule, index) => <option key={index} value={rule._id}>{rule.tag}</option>)}
                        </select>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
                    <div className="input-group">
                        <span className="input-group-text">Search</span>
                        <input type="search" name="searchFilter" value={filters.searchFilter} className="form-control" onChange={this.handleFilterChange} />
                    </div>
                </div>
            </div>
            <button className="btn btn-sm btn-dark me-2" onClick={() => this.toggleFiltersView()}>
                <i className="bi bi-x-lg"></i>
            </button>
            <button className="btn btn-sm btn-dark me-2" onClick={this.props.resetFilters}>
                <i className="bi bi-trash-fill"></i>
            </button>
        </div>;
    }

    getFiltersButton() {
        return <button
            className="btn btn-dark rounded-circle m-2"
            onClick={() => this.toggleFiltersView()}
            style={{ width: "50px", height: "50px" }}
        ><i className="bi bi-funnel-fill"></i></button>;
    }

    render() {
        return <div className="">
            {this.getDateFilter()}
            <div className="position-fixed z-1 bottom-0 start-0">
                {this.getFilters()}
            </div>
        </div>;
    }
}

export default connect(state => _.pick(state.user, ["accountsMap", "rulesMap"]))(FiltersView);