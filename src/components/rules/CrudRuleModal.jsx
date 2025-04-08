"use strict";

import React from "react";
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import Modal from "@modal/Modal.jsx";
import { upsertRuleRequest } from "@store";

function getDerivedStateFromProps(props) {
    return {
        _id: props.rule?._id || "",
        tag: props.rule?.tag || "",
        keywords: props.rule?.keywords || "",
        description: props.rule?.description || "",
    };
}

class CrudRuleModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = getDerivedStateFromProps(props);
        this.formRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.rule !== this.props.rule) {
            this.setState(getDerivedStateFromProps(this.props));
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.state.tag = this.state.tag || this.state.name;
        this.props.dispatch(upsertRuleRequest(this.state)).then(data => {
            toast.info("Rule saved ✅");
            const onSave = this.props.onSave || this.props.onClose || (() => { });
            onSave(data.payload);
        });
    };

    getModalTitle() {
        return this.props.rule?._id ? "Edit Rule" : "Add Rule";
    }

    onSubmitClick = () => {
        if (this.formRef.current) {
            this.formRef.current.requestSubmit();
        }
    }

    getModalBody() {
        const { name, keywords, tag } = this.state;
        return (
            <form ref={this.formRef} onSubmit={this.handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Tag</label>
                    <input type="text" className="form-control" name="tag" value={tag || name} onChange={this.handleChange} placeholder="Tag" required />
                </div>
                <div className="mb-2">
                    <label className="form-label">Keywords</label>
                    <textarea className="form-control" name="keywords" value={keywords} onChange={this.handleChange} placeholder="Keywords (eg: Keyword1, Keyword2)" required />
                </div>
            </form>
        );
    }

    render() {
        return <Modal show={this.props.show} title={this.getModalTitle()} body={this.getModalBody()} onClose={this.props.onClose} onSubmitClick={this.onSubmitClick} />;
    }
}

export default connect()(CrudRuleModal);