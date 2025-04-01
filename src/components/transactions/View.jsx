"use strict";

import React from "react";
import TransactionsTable from "./TransactionsTable.jsx";

export default class View extends React.Component {

    render() {
        return <TransactionsTable isDraft={false} startDateFilter={moment().startOf("month").format("YYYY-MM-DD")} endDateFilter={moment().format("YYYY-MM-DD")} />;
    }
}