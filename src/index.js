"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from '@store/store';
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@styles/common.scss';
import App from "./App.jsx";

function Container() {
    return <Provider store={store}>
        <BrowserRouter basename="/">
            <ToastContainer />
            <App />
        </BrowserRouter>
    </Provider>
}

ReactDOM.render(<Container />, document.getElementById("container"));