"use strict";

import React from "react";
import { connect } from "react-redux";
import Request from "../../Utils/Request";
import { setUserDetails } from "store";

class Profile extends React.Component {
    handleLogout = () => {
        Request.post("/user/logout").then(data => {
            if (data.success) {
                this.props.dispatch(setUserDetails({}));
            } else {
                console.error("Logout failed:", data.error);
            }
        });
    }
    render() {
        const { userInfo } = this.props;
        return (
            <div className="">
                <div className="card shadow-sm p-4">
                    <div className="d-flex flex-column flex-sm-row align-items-center">
                        <img src={userInfo.picture} className="rounded-circle border" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                        <div className="ms-sm-3 text-center text-sm-start mt-3 mt-sm-0 w-100">
                            <h3 className="mb-1">{userInfo.name}</h3>
                            <p className="text-muted mb-0 text-break">{userInfo.email}</p>
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-center">
                        <button className="btn btn-danger" onClick={this.handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(state=>state)(Profile);