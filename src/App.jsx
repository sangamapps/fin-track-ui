"use strict";

import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/Login.jsx";
import Layout from "./components/Layout.jsx";

const links = [
    { path: '/', LayoutBody: lazy(() => import('./components/DashBoard.jsx')) },
    { path: '/transactions', LayoutBody: lazy(() => import('./components/Transactions.jsx')) },
    { path: '/accounts', LayoutBody: lazy(() => import('./components/Accounts.jsx')) },
    { path: '/rules', LayoutBody: lazy(() => import('./components/Rules.jsx')) },
    { path: '/profile', LayoutBody: lazy(() => import('./components/Profile.jsx')) },
];

function getRoutes() {
    return <Switch>
        {links.map((o, i) => <Route exact={true} key={i} path={o.path} render={(props) => <Layout {...props} LayoutBody={o.LayoutBody} />} />)}
        <Redirect to="/" />
    </Switch>;
}

export default function () {
    const { userInfo } = useSelector(state => state);
    return <div className="app-body">
        {userInfo && userInfo.email ? getRoutes() : <Login />}
    </div>;
}