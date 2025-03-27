"use strict";

import axios from "axios";

async function request(path, method, data = {}, headers) {
    const config = {
        url: path,
        method,
        ...data,
    };
    if (headers) {
        config.headers = headers;
    }
    const response = await axios(config);
    return response.data;
}

export default class {
    static get(path, params) {
        return request(path, 'GET', { params });
    }

    static post(path, data, headers) {
        return request(path, 'POST', { data }, headers);
    }

    static delete(path) {
        return request(path, 'DELETE');
    }
}