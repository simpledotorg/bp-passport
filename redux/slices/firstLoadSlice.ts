import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  firstLoad: boolean
}

const initialState: InitialState = {
  firstLoad: true,
}

const firstLoadSlice = createSlice({
  name: 'firstLoad',
  initialState,
  reducers: {
    setFirstLoad: (
      state: InitialState,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.firstLoad = payload
    },
  },
})

export { firstLoadSlice }
