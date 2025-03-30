"use strict";

import React from "react";
import { Switch, Route } from "react-router-dom";
import LazyLoad from "@components/lazy-load/LazyLoad.jsx";

const routes = [
    { path: '/transactions', component: <LazyLoad component={() => import('./View.jsx')} /> },
    { path: '/transactions/upload-statement', component: <LazyLoad component={() => import('./Upload.jsx')} /> },
];

function getRoute(route, key) {
    return <Route key={key} exact={true} path={route.path} component={()=>route.component} />;
}

export default function getRoutes() {
    return <Switch>
        {routes.map(getRoute)}
    </Switch>;
}