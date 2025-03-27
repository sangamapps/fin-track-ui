import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Request from "./Request";
import { GOOGLE_CLIENT_ID } from "./Config";
import { setUserAction } from 'AppRedux';

export default class extends React.Component {

    onSuccess(credentialResponse) {
        Request.post("/user/login", { token: credentialResponse.credential }).then(data => {
            if (data.success) {
                setUserAction(data.user);
            } else {
                console.error("Login failed:", data.error);
            }
        });
    }

    onError() {
        console.log("Google Login Failed");
    }

    getGoogleLoginButton() {
        return (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={this.onSuccess} onError={this.onError} />
            </GoogleOAuthProvider>
        );
    }

    render() {
        return (
            <div className="container text-center mt-5">
                <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
                    <h2 className="mb-3">Finance Tracker</h2>
                    {this.getGoogleLoginButton()}
                </div>
            </div>
        );
    }
}
