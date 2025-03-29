"use strict";

import http from "./http";

export default {
    login: (token) => http.post("/api/v1/user/login", { token }),
    logout: () => http.post("/api/v1/user/logout"),
}