"use strict";

import { createStore } from 'redux';
import userReducer from './user/reducers';

const store = createStore(userReducer);
export default store;