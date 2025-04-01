"use strict";

import React from "react";
import TransactionsTable from "./TransactionsTable.jsx";
import transactionService from "@services/transactionService.js";

export default class View extends React.Component {

    bulkSave = () => {
        transactionService.bulkSave().then(() => toast.info("Transactions saved ✅"));
    }

    render() {
        return <div className="mb-3">
            <TransactionsTable isDraft={true} bulkSave={true} />
        </div>;
    }
}