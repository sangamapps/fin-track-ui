"use strict";

import constants from './constants';
import store from '../store';

export function setUserAction(userInfo) {
    store.dispatch({
        type: constants.SET_USER_DETAILS,
        userInfo,
    })
}