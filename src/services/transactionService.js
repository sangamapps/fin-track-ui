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
}