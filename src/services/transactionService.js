"use strict";

import http from "./http";

export default {
    extract: (extractor, file) => {
        const formData = new FormData();
        formData.append("extractor", extractor);
        formData.append("file", file);
        const headers = { "Content-Type": "multipart/form-data" };
        return http.post("/api/v1/transactions/extract", formData, headers);
    },
    bulkSave: (account, transactions) => http.post("/api/v1/transactions/save", { account, transactions }),
    getAll: () => http.get("/api/v1/transactions"),
    upsert: (transaction) => http.post("/api/v1/transaction", transaction),
    delete: (transactionId) => http.delete(`/api/v1/transaction/${transactionId}`),
}