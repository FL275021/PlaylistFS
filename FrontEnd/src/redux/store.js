import { configureStore } from '@reduxjs/toolkit'
import tareasSlice from "./features/tareasSlice.js"
import usersSlice from './features/usersSlice.js'
import authReducer from "./features/authSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tareasSlice,
        usersSlice,
    },
})