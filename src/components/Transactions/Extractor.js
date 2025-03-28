"use strict";

import Request from "../../Utils/Request";

export default class {
    static getTransactions(extractor, file) {
        const formData = new FormData();
        formData.append("extractor", extractor);
        formData.append("file", file);
        const headers = { "Content-Type": "multipart/form-data" };
        return Request.post("/api/v1/extract-transactions", formData, headers);
    }
}