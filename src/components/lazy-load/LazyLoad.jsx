"use strict";

import React, { Suspense, lazy } from "react";

export default class LazyLoad extends React.Component {

    getSpinner(){
        return <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    getLoader() {
        const {loaderType} = this.props;
        switch(loaderType){
            default:
                return this.getSpinner();
        }
    }

    render() {
        const Component = lazy(this.props.component);
        return <Suspense fallback={this.getLoader()}>
            <Component/>
        </Suspense>;
    }
}