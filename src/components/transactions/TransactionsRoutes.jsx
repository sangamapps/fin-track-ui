"use strict";

import React from "react";
import { Switch, Route } from "react-router-dom";
import LazyLoad from "@components/lazy-load/LazyLoad.jsx";

const routes = [
    {
        path: '/',
        component: () => import("./TransactionsLayout.jsx"),
        props: {
            LayoutBody: () => import('./StatsView.jsx'),
            startDateFilter: moment().startOf("month").format("YYYY-MM-DD"),
            endDateFilter: moment().format("YYYY-MM-DD"),
        }
    },
    {
        path: '/transactions',
        component: () => import("./TransactionsLayout.jsx"),
        props: {
            LayoutBody: () => import('./TransactionsView.jsx'),
            isDraft: false,
            startDateFilter: moment().startOf("month").format("YYYY-MM-DD"),
            endDateFilter: moment().format("YYYY-MM-DD"),
        }
    },
    {
        path: '/transactions/drafts',
        component: () => import("./TransactionsLayout.jsx"),
        props: {
            LayoutBody: () => import('./TransactionsView.jsx'),
            isDraft: true,
        }
    },
    {
        path: '/transactions/upload-statement',
        component: () => import('./UploadView.jsx')
    },
];

function getRoute(route, key) {
    return <Route key={key} exact={true} path={route.path} component={() => <LazyLoad component={route.component} {...route.props} />} />;
}

export default function getRoutes() {
    return <Switch>
        {routes.map(getRoute)}
    </Switch>;
}