"use strict";

import React, { Suspense, lazy } from "react";
import uiUtil from "@utils/uiUtil";

export default class LazyLoad extends React.Component {

    render() {
        const Component = lazy(this.props.component);
        return <Suspense fallback={uiUtil.spinnerLoader("text-primary")}>
            <Component {...this.props}/>
        </Suspense>;
    }
}