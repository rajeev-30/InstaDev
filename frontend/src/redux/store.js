import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import userReducer from './userSlice'
import workspaceReducer from './workspaceSlice'
import storage from "redux-persist/es/storage";

const rootReducer = combineReducers({
    user: userReducer,
    workspace: workspaceReducer
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
}

console.log(storage);

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
})

export const persistor = persistStore(store)