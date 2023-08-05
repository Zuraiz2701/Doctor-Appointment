import { configureStore } from "@reduxjs/toolkit";
import { altertSlice } from "./features/alterSlice";

export default configureStore({
    reducer: {
        alerts: altertSlice.reducer,
    }
})

