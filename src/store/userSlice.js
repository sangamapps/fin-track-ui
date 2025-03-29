import { createSlice } from "@reduxjs/toolkit";

let data = null;
try {
    data = document.querySelector("meta[name='user-info']").content;
    data = JSON.parse(data);
    console.log("data::", data);
} catch (e) {
    console.log("data::", data);
    data = null;
    console.log("ERR::onParseUser", e);
}

const initialState = {
    ...data,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action) => action.payload
    }
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;