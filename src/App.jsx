"use strict";

import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import LazyLoad from "@components/lazy-load/LazyLoad.jsx";
import Layout from "@components/layout/HomeLayout.jsx";

const routes = [
    { path: '/accounts', LayoutBody: <LazyLoad component={() => import('@components/accounts/Accounts.jsx')} /> },
    { path: '/rules', LayoutBody: <LazyLoad component={() => import('@components/rules/Rules.jsx')} /> },
    { path: '/profile', LayoutBody: <LazyLoad component={() => import('@components/profile/Profile.jsx')} /> },
    { path: '/', LayoutBody: <LazyLoad component={() => import('@components/transactions/TransactionsRoutes.jsx')} /> },
];

function getRoute(route, key) {
    return <Route key={key}
        path={route.path} exact={route.exact}
        render={(props) => <Layout {...props} LayoutBody={route.LayoutBody} />} />;
}

function getRoutes() {
    return <Switch>
        {routes.map(getRoute)}
        <Redirect to="/" />
    </Switch>;
}

export default function () {
    const userInfo = useSelector(state => state.user.info);
    return <div className="app-body">
        {userInfo && userInfo.email ? getRoutes() : <LazyLoad component={() => import('@components/login/Login.jsx')} />}
    </div>;
}