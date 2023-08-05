import { createSlice } from "@reduxjs/toolkit";


export const altertSlice = createSlice({
    name: "alter",
    initialState: {
        loading: false,
    },
    reducers: {
        showLoading: (state) => {
            state.loading = true;
        },
        hideLoading: (state) => {
            state.loading = false;
        }
    }
});

export const { showLoading, hideLoading } = altertSlice.actions;