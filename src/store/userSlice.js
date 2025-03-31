import { createSlice } from "@reduxjs/toolkit";

let info = null;
try {
    info = document.querySelector("meta[name='user-info']").content;
    info = JSON.parse(info);
    console.log("info::", info);
} catch (e) {
    console.log("info::", info);
    info = null;
    console.log("ERR::onParseUser", e);
}

const initialState = {
    info,
    accounts: [],
    rules: [],
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (user, action) => {
            user.info = action.payload;
        }
    }
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;