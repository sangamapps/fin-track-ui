"use strict";

import http from "./http";

export default {
    login: (token) => http.post("/user/login", { token }),
    logout: () => http.post("/user/logout"),
}