"use strict";

import React, { Suspense } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Layout extends React.Component {

    getProfileLink() {
        return <Link to="/profile" className="nav-link">
            <img src={this.props.userInfo.picture} className="rounded-circle border" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
        </Link>;
    }

    getActiveStatus(to) {
        return this.props.location.pathname == to ? "active" : "";
    }

    getLink(to, content) {
        return <Link to={to} className={"nav-link " + this.getActiveStatus(to)}>{content}</Link>;
    }

    getLoader(){
        return <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    render() {
        const { LayoutBody } = this.props;
        return <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <div className="navbar-brand">Finance Tracker</div>
                    <button className="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                {this.getLink("/", "Dashboard")}
                            </li>
                            <li className="nav-item">
                                {this.getLink("/transactions", "Transactions")}
                            </li>
                            <li className="nav-item">
                                {this.getLink("/accounts", "Accounts")}
                            </li>
                            <li className="nav-item">
                                {this.getLink("/rules", "Rules")}
                            </li>
                            <li className="nav-item d-lg-none">
                                {this.getProfileLink()}
                            </li>
                        </ul>
                    </div>
                    <div className="ms-3 d-none d-lg-block">
                        {this.getProfileLink()}
                    </div>
                </div>
            </nav>
            <div className="container-fluid mt-3">
                <Suspense fallback={this.getLoader()}>
                    <LayoutBody />
                </Suspense>
            </div>
        </div>
    }
}

export default connect(state => state)(Layout);
