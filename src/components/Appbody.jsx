"use strict";

import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Upload from "./Upload.jsx";

function AppBody() {
    const { userInfo } = useSelector(state => state);
    return <div className="app-body">
        <Switch>
            <Route path="/upload" component={Upload} />
            <Redirect to="/upload" />
        </Switch>
    </div>;
}

export default AppBody;