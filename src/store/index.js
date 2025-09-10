import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import countriesReducer from './slices/countriesSlice';
import channelsReducer from './slices/channelsSlice';
import uiReducer from './slices/uiSlice';
import searchReducer from './slices/searchSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['countries', 'ui'], // Only persist these reducers
};

// Root reducer
const rootReducer = combineReducers({
  countries: countriesReducer,
  channels: channelsReducer,
  ui: uiReducer,
  search: searchReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

export default store;
