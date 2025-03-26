"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from './components/redux/store';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/tab';
import 'styles/common.scss';
import App from "./App.jsx";

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("container"));