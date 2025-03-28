"use strict";

import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import LazyLoad from "./Components/LazyLoad/LazyLoad.jsx";
import Layout from "./Components/Layout/Layout.jsx";

const routes = [
    { path: '/', LayoutBody: <LazyLoad component={() => import('./Components/DashBoard/DashBoard.jsx')} /> },
    { path: '/transactions', LayoutBody: <LazyLoad component={() => import('./Components/Transactions/Transactions.jsx')} /> },
    { path: '/accounts', LayoutBody: <LazyLoad component={() => import('./Components/Accounts/Accounts.jsx')} /> },
    { path: '/rules', LayoutBody: <LazyLoad component={() => import('./Components/Rules/Rules.jsx')} /> },
    { path: '/profile', LayoutBody: <LazyLoad component={() => import('./Components/Profile/Profile.jsx')} /> },
];

function getRoute(route, key) {
    return <Route key={key}
        path={route.path} exact={true}
        render={(props) => <Layout {...props} LayoutBody={route.LayoutBody} />} />;
}

function getRoutes() {
    return <Switch>
        {routes.map(getRoute)}
        <Redirect to="/" />
    </Switch>;
}

export default function () {
    const { userInfo } = useSelector(state => state);
    return <div className="app-body">
        {userInfo && userInfo.email ? getRoutes() : <LazyLoad component={() => import('./Components/Login/Login.jsx')} />}
    </div>;
}