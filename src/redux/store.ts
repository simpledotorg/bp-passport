import AsyncStorage from '@react-native-community/async-storage'
import {createStore, applyMiddleware, Action} from 'redux'
import thunkMiddleware, {ThunkAction} from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {persistStore, persistReducer} from 'redux-persist'

import rootReducer from './root.reducer'

const loggerMiddleware = createLogger()
const middlewares = [thunkMiddleware, loggerMiddleware]

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['auth', 'patient'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, applyMiddleware(...middlewares))
const persistor = persistStore(store)

export {store, persistor}

export type RootState = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
