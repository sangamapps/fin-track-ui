"use strict";

import React from "react";
import CrudRuleModal from "./CrudRuleModal.jsx";
import ruleService from "@services/ruleService";

export default class Rules extends React.Component {
    state = {
        getRulesLoadingStatus: false,
        rules: [],
        selectedRule: null,
        showModal: false,
    };

    toggleModal = (selectedRule = null) => {
        return new Promise((resolve) => {
            this.setState({ showModal: !this.state.showModal, selectedRule }, resolve);
        });
    };

    handleSave = (rule) => {
        const existingRule = _.find(this.state.rules, { _id: rule._id });
        if (existingRule) {
            _.assign(existingRule, rule);
        } else {
            this.state.rules.push(rule);
        }
        this.toggleModal();
    };

    handleDelete = (id) => {
        ruleService.delete(id).then(this.getRules);
    };

    getRulesContainer() {
        const { rules } = this.state;

        if (rules.length === 0) {
            if (this.state.getRulesLoadingStatus) {
                return <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>;
            }
            return <div className="alert alert-info" role="alert">No rules found</div>;
        }

        return (
            <div className="row">
                {rules.map((rule, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{rule.name}</h5>
                                <p className="card-text"><strong>Contains:</strong> {rule.contains}</p>
                                <span className="badge bg-primary">{rule.tag}</span>
                                <div className="mt-3 d-flex justify-content-between">
                                    <button className="btn btn-warning btn-sm" onClick={() => this.toggleModal(rule)}>
                                        <i className="bi bi-pencil"></i> Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(rule._id)}>
                                        <i className="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    getCrudRuleModal() {
        return <CrudRuleModal show={this.state.showModal} rule={this.state.selectedRule} onSave={this.handleSave} onClose={() => this.toggleModal()} />;
    }

    getAddButton() {
        return <button
            className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
            onClick={() => this.toggleModal()}
            style={{ width: "50px", height: "50px" }}
        >+</button>;
    }

    render() {
        const { rules, showModal, selectedRule } = this.state;

        return (
            <div className="container mt-3">
                <h1>Rules</h1>
                {this.getRulesContainer()}
                {this.getCrudRuleModal()}
                {this.getAddButton()}
            </div>
        );
    }

    getRules = () => {
        this.setState({ getRulesLoadingStatus: true }, () => {
            ruleService.getAll().then(data => {
                this.setState({ getRulesLoadingStatus: false, rules: data.rules });
            });
        });
    }

    componentDidMount() {
        this.getRules();
    }
}
