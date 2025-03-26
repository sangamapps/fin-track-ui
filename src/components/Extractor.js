"use strict";

import axios from "axios";

async function getTransactions(extractor, file) {
    const formData = new FormData();
    formData.append("extractor", extractor);
    formData.append("file", file);
    const response = await axios.post("/api/v1/extract-transactions", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export default {
    getTransactions
};