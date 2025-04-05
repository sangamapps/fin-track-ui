"use strict";

import React from "react";
import LazyLoad from "@components/lazy-load/LazyLoad.jsx";
import "chart.js/auto";
import { setStatsGroupByPeriod } from "@store";
import { connect } from "react-redux";

const charts = [
    {
        component: () => import("./BalanceTrends.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
    },
    {
        component: () => import("./TransactionTypeTrends.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
        props: { transactionType: "DEBIT" },
    },
    {
        component: () => import("./TransactionTypeTrends.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
        props: { transactionType: "CREDIT" },
    },
    {
        component: () => import("./TransactionCountTrends.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
    },
    {
        component: () => import("./TransactionAmountCount.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
    },
    {
        component: () => import("./TransactionAmountSum.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
    },
    {
        component: () => import("./TagAmountCount.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
    },
    {
        component: () => import("./TagAmountSum.jsx"),
        className: "col-sm-12 col-md-6 col-lg-4 mb-3",
    },
];

class StatsView extends React.Component {

    state = {
        showStatsView: true,
    }

    handleChange = (e) => {
        this.props.dispatch(setStatsGroupByPeriod(e.target.value));
    }

    render() {
        const { statsGroupByPeriod, filteredTransactions } = this.props;
        if(filteredTransactions.length == 0) return <></>;
        return (
            <div className="">
                <div className="mb-2 d-flex align-items-center">
                    <h3>Stats</h3>
                    <select className="form-select w-auto ms-auto me-2" value={statsGroupByPeriod} onChange={this.handleChange}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="overall">Overall</option>
                    </select>
                    <button className="btn btn-dark" onClick={() => this.setState({ showStatsView: !this.state.showStatsView })}>
                        {this.state.showStatsView ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}
                    </button>
                </div>

                {this.state.showStatsView && <div className="row">
                    {charts.map((chart, index) => (
                        <div key={index} className={chart.className}>
                            <LazyLoad component={chart.component} timeFilter={statsGroupByPeriod} filteredTransactions={filteredTransactions} {...chart.props} />
                        </div>
                    ))}
                </div>}
            </div>
        );
    }
};

export default connect(state => _.pick(state.user, ["statsGroupByPeriod"]))(StatsView);