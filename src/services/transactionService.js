"use strict";

import http from "./http";

export default {
    extract: (accountId, extractor, file) => {
        const formData = new FormData();
        formData.append("accountId", accountId);
        formData.append("extractor", extractor);
        formData.append("file", file);
        const headers = { "Content-Type": "multipart/form-data" };
        return http.post("/api/v1/transactions/extract", formData, headers);
    },
    saveDrafts: () => http.post("/api/v1/transactions/save-drafts"),
    deleteDrafts: () => http.post("/api/v1/transactions/delete-drafts"),
    getAll: (startDate, endDate, isDraft, sortByDate) => http.get("/api/v1/transactions", {startDate, endDate, isDraft, sortByDate}),
    upsert: (transaction) => http.post("/api/v1/transaction", transaction),
    delete: (transactionId) => http.delete(`/api/v1/transaction/${transactionId}`),
}