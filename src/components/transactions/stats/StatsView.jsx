"use strict";

import React from "react";
import LazyLoad from "@components/lazy-load/LazyLoad.jsx";
import "chart.js/auto";
import { setStatsGroupByPeriod } from "@store";
import { connect } from "react-redux";

const charts = [
    {
        component: () => import("./BalanceTrends.jsx"),
        className: "col-sm-12 col-md-6 mb-3",
    },
    {
        component: () => import("./TransactionTypeTrends.jsx"),
        className: "col-sm-12 col-md-6 mb-3",
        props: { transactionType: "DEBIT" },
    },
    {
        component: () => import("./TransactionTypeTrends.jsx"),
        className: "col-sm-12 col-md-6 mb-3",
        props: { transactionType: "CREDIT" },
    },
    {
        component: () => import("./TransactionCountTrends.jsx"),
        className: "col-sm-12 col-md-6 mb-3",
    },
    {
        component: () => import("./TransactionAmountCount.jsx"),
        className: "col-sm-12 col-md-6 mb-3",
    },
    {
        component: () => import("./TransactionAmountSum.jsx"),
        className: "col-sm-12 col-md-6 mb-3",
    },
];

class StatsView extends React.Component {

    handleChange = (e) => {
        this.props.dispatch(setStatsGroupByPeriod(e.target.value));
    }

    render() {
        const { statsGroupByPeriod, filteredTransactions } = this.props;
        if(filteredTransactions.length == 0) return <></>;
        return (
            <div className="">
                <div className="mb-2 d-flex justify-content-between align-items-center">
                    <h3>Stats</h3>
                    <select className="form-select w-auto" value={statsGroupByPeriod} onChange={this.handleChange}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="overall">Overall</option>
                    </select>
                </div>

                <div className="row">
                    {charts.map((chart, index) => (
                        <div key={index} className={chart.className}>
                            <LazyLoad component={chart.component} timeFilter={statsGroupByPeriod} filteredTransactions={filteredTransactions} {...chart.props} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default connect(state => _.pick(state.user, ["statsGroupByPeriod"]))(StatsView);