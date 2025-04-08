"use strict";

import React from "react";
import "chart.js/auto";
import { setStatsGroupByPeriod } from "@store";
import { charts } from "@utils/statsChartUtil"
import { connect } from "react-redux";

class StatsView extends React.Component {

    state = {
        showStatsView: true,
    }

    handleChange = (e) => {
        this.props.dispatch(setStatsGroupByPeriod(e.target.value));
    }

    getApplicableTransactions(transactions, filters) {
        return _.filter(transactions, (transaction) => {
            if (_.isEmpty(filters)) return true;
            return _.every(filters, (value, key) => {
                return _.get(transaction, key) == value;
            });
        });
    }

    getChartCard = (chart, index) => {
        const { statsGroupByPeriod, filteredTransactions, accountsMap, rules } = this.props;
        const applicableTransactions = this.getApplicableTransactions(filteredTransactions, chart.filters);
        if (applicableTransactions.length == 0) return null;
        const { labels, data } = chart.getData(applicableTransactions, accountsMap, statsGroupByPeriod, rules);
        const datasets = chart.getDatasets(data);
        return <div key={index} className={chart.className}>
            <div className="card shadow-sm p-3">
                <h5 className="card-title">{chart.title}</h5>
                <div className="chart-container">
                    <chart.Chart data={{ labels, datasets }} />
                </div>
            </div>
        </div>;
    }

    getChartCards() {
        if (!this.state.showStatsView) return [];
        return charts.map(this.getChartCard).filter(c => c != null);
    }

    render() {
        const { statsGroupByPeriod, filteredTransactions } = this.props;
        if (filteredTransactions.length == 0) return <div />;
        const chartViews = this.getChartCards();
        if (chartViews.length == 0) return <div />;
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
                <div className="row">{chartViews}</div>
            </div>
        );
    }
};

export default connect(state => _.pick(state.user, ["statsGroupByPeriod", "accountsMap", "rules"]))(StatsView);