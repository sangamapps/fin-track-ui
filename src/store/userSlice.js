import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "@services/accountService";
import ruleService from "@services/ruleService";

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
    loadingAccounts: false,
    loadingRules: false,
    accounts: [],
    rules: [],
    accountsMap: {},
    rulesMap: {},
    statsGroupByPeriod: "weekly",
}

export const fetchAccountsRequest = createAsyncThunk(
    "user/fetchAccountsRequest",
    async () => {
        return await accountService.getAll();
    }
);

export const fetchRulesRequest = createAsyncThunk(
    "user/fetchRulesRequest",
    async () => {
        return await ruleService.getAll();
    }
);

export const upsertAccountRequest = createAsyncThunk(
    "user/upsertAccountRequest",
    async (account) => {
        return await accountService.upsert(account);
    }
);

export const upsertRuleRequest = createAsyncThunk(
    "user/upsertRuleRequest",
    async (rule) => {
        return await ruleService.upsert(rule);
    }
);

export const deleteAccountRequest = createAsyncThunk(
    "user/deleteAccountRequest",
    async (_id) => {
        return await accountService.delete(_id);
    }
);

export const deleteRuleRequest = createAsyncThunk(
    "user/deleteRuleRequest",
    async (_id) => {
        return await ruleService.delete(_id);
    }
);

const reducers = {
    setUserDetails: (user, action) => {
        user.info = action.payload;
    },
    setStatsGroupByPeriod: (user, action) => {
        user.statsGroupByPeriod = action.payload;
    },
    upsertAccount: (user, action) => {
        const { account } = action.payload;
        const index = _.findIndex(user.accounts, a => a._id == account._id);
        if (index >= 0) {
            user.accounts[index] = account;
        } else {
            user.accounts.push(account);
        }
        user.accountsMap[account._id] = account;
    },
    upsertRule: (user, action) => {
        const { rule } = action.payload;
        const index = _.findIndex(user.rules, a => a._id == rule._id);
        if (index >= 0) {
            user.rules[index] = rule;
        } else {
            user.rules.push(rule);
        }
        user.rulesMap[rule._id] = rule;
    },
    deleteAccount: (user, action) => {
        const index = _.findIndex(user.accounts, a => a._id == action.payload._id);
        user.accounts.splice(index, 1);
    },
    deleteRule: (user, action) => {
        const index = _.findIndex(user.rules, a => a._id == action.payload._id);
        user.rules.splice(index, 1);
    },
    updateAccounts: (user, action) => {
        user.accounts = action.payload.accounts;
        user.accountsMap = _.keyBy(user.accounts, "_id");
        user.loadingAccounts = false;
    },
    updateRules: (user, action) => {
        user.rules = action.payload.rules;
        user.rulesMap = _.keyBy(user.rules, "_id");
        user.loadingRules = false;
    },
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: { ...reducers },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccountsRequest.pending, (user) => {
                user.loadingAccounts = true;
            })
            .addCase(fetchRulesRequest.pending, (user) => {
                user.loadingRules = true;
            })
            .addCase(fetchAccountsRequest.fulfilled, reducers.updateAccounts)
            .addCase(fetchRulesRequest.fulfilled, reducers.updateRules)
            .addCase(fetchAccountsRequest.rejected, (user) => {
                user.loadingAccounts = false;
            })
            .addCase(fetchRulesRequest.rejected, (user) => {
                user.loadingRules = false;
            })
            .addCase(upsertAccountRequest.fulfilled, reducers.upsertAccount)
            .addCase(upsertRuleRequest.fulfilled, reducers.upsertRule)
            .addCase(deleteAccountRequest.fulfilled, reducers.deleteAccount)
            .addCase(deleteRuleRequest.fulfilled, reducers.deleteRule);
    }
});

export const {
    setUserDetails,
    setStatsGroupByPeriod,
    upsertAccount,
    upsertRule,
    deleteAccount,
    deleteRule,
    updateAccounts,
    updateRules,
} = userSlice.actions;

export default userSlice.reducer;