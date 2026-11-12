import { configureStore } from '@reduxjs/toolkit'
import tareasSlice from "./features/tareasSlice.js"
import usersSlice from './features/usersSlice.js'
import authReducer from "./features/authSlice.js"
import playlistsReducer from "./features/playlistsSlice.js"
import genresReducer from "./features/genresSlice.js"
import planUsageReducer from "./features/planUsageSlice.js"
import loadingReducer from "./features/loadingSlice.js"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tareasSlice,
        usersSlice,
        playlists: playlistsReducer,
        genres: genresReducer,
        planUsage: planUsageReducer,
        loadingSlice: loadingReducer,
    },
})