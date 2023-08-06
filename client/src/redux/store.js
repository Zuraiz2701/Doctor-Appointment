import { configureStore } from "@reduxjs/toolkit";
import { altertSlice } from "./features/alterSlice";
import { UserSlice } from "./features/userSlice"

export default configureStore({
    reducer: {
        alerts: altertSlice.reducer,
        user: UserSlice.reducer,
    }
})

