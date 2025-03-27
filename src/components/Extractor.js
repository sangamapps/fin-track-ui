"use strict";

import Request from "./Request";

async function getTransactions(extractor, file) {
    const formData = new FormData();
    formData.append("extractor", extractor);
    formData.append("file", file);
    return await Request.post("/api/v1/extract-transactions", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export default {
    getTransactions
};