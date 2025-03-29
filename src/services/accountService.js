"use strict";

import http from "./http";

export default {
    getAll: () => http.get("/api/v1/accounts"),
    upsert: (account) => http.post("/api/v1/account", account),
    delete: (_id) => http.delete(`/api/v1/account/${_id}`),
}