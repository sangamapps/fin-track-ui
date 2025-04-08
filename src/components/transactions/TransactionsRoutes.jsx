"use strict";

import React from "react";
import { Switch, Route } from "react-router-dom";
import LazyLoad from "@components/lazy-load/LazyLoad.jsx";

const routes = [
    {
        path: '/',
        component: () => import("./TransactionsLayout.jsx"),
        props: {
            isDraft: 0,
            startDateFilter: moment().startOf("year").format("YYYY-MM-DD"),
            endDateFilter: moment().format("YYYY-MM-DD"),
            sortByDate: 1,
        }
    },
    {
        path: '/transactions/drafts',
        component: () => import("./TransactionsLayout.jsx"),
        props: {
            isDraft: 1,
            sortByDate: 1,
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