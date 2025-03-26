"use strict";

import constants from './constants';

let userInfo = null;
try {
    userInfo = document.querySelector("meta[name='user-info']").content;
    userInfo = JSON.parse(userInfo);
    console.log("userInfo::", userInfo);
} catch (e) {
    console.log("userInfo::", userInfo);
    userInfo = null;
    console.log("ERR::onParseUser", e);
}

const initialState = {
    userInfo,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case constants.SET_USER_DETAILS:
            newState = Object.assign({}, state, {
                userInfo: action.userInfo,
            });
            return newState;
        default: return state;
    }
}