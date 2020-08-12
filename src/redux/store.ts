import AsyncStorage from '@react-native-community/async-storage'
import {createStore, applyMiddleware, Action} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {useDispatch} from 'react-redux'
import {createLogger} from 'redux-logger'
import {
  persistStore,
  persistReducer,
  createMigrate,
  MigrationManifest,
} from 'redux-persist'
import autoMerge from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import rootReducer from './root.reducer'
import {LoginState} from './auth/auth.models'
export type RootState = ReturnType<typeof rootReducer>

const loggerMiddleware = createLogger()
const middlewares = [thunkMiddleware /*, loggerMiddleware*/]

if (__DEV__) {
  /*
  console.log('DEV MODE!')
  const createDebugger = require('redux-flipper').default
  middlewares.push(createDebugger()) */
}

const migrations: MigrationManifest = {
  1: (state) => {
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
  whitelist: ['auth', 'patient', 'bloodPressure', 'bloodSugar'],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: ['medication'],
  stateReconciler: autoMerge,
  migrate: createMigrate(migrations, {debug: false}),
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)
const store = createStore(persistedReducer, applyMiddleware(...middlewares))
const persistor = persistStore(store)

export {store, persistor}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

/*
export type ReduxDispatch = ThunkDispatch<IMyStoreType, any, Action>;
export function useReduxDispatch(): ReduxDispatch {
  return useDispatch<ReduxDispatch>();
}
*/

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>()
/*
export const appThunkDispatch = store.dispatch as Dispatch<Action<any>> &
  ThunkDispatch<any, undefined, AnyAction>
*/
