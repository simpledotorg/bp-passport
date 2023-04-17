import AsyncStorage from '@react-native-async-storage/async-storage'
import { createStore, applyMiddleware, Action, AnyAction } from 'redux'
import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { useDispatch } from 'react-redux'
import {
  persistStore,
  persistReducer,
  createMigrate,
  MigrationManifest,
} from 'redux-persist'
import autoMerge from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import rootReducer from './root.reducer'
import { LoginState } from './auth/auth.models'
export type RootState = ReturnType<typeof rootReducer>

const middlewares = [thunkMiddleware]

const migrations: MigrationManifest = {
  1: (state: any) => {
    // migration clear out device state
    //  console.log('Do migration!')
    return {
      ...state,
      auth: {
        ...state.auth,
        loginState: Math.min(state.auth.loginState, LoginState.LoggedIn),
      },
    }
  },
}

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'auth',
    'patient',
    'bloodPressure',
    'bloodSugar',
    'medicationSchedule',
    'firstLoad',
    'notifications',
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['medication'],
  stateReconciler: autoMerge,
  migrate: createMigrate(migrations, { debug: false }),
}

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  rootPersistConfig,
  rootReducer,
)

const store = createStore(persistedReducer, applyMiddleware(...middlewares))
const persistor = persistStore(store)

export { store, persistor }

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>()
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>
