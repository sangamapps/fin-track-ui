"use strict";

import http from "./http";

export default class {
    static getAll() {
        return http.get("/api/v1/accounts");
    }
    static upsert(account) {
        return http.post("/api/v1/account", account);
    }
    static delete(id) {
        return http.delete(`/api/v1/account/${id}`);
    }
}