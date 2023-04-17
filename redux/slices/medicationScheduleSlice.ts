import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MedicationSchedule = {
  medication: string
  schedule: string
}

type InitialState = {
  MedicationSchedule: MedicationSchedule[]
}

const initialState: InitialState = {
  MedicationSchedule: [],
}

const medicationScheduleSlice = createSlice({
  name: 'medicationSchedule',
  initialState,
  reducers: {
    setMedicationSchedule: (
      state: InitialState,
      { payload }: PayloadAction<MedicationSchedule>,
    ) => {
      state.MedicationSchedule = [...state.MedicationSchedule, payload] || []
    },
    setDeleteMedicationSchedule: (
      state: InitialState,
      { payload }: PayloadAction<string>,
    ) => {
      const filteredSchedules = state.MedicationSchedule.filter(
        (schedule) => schedule.medication !== payload,
      )
      state.MedicationSchedule = filteredSchedules || []
    },

    reset: () => initialState,
  },
})

export { medicationScheduleSlice }
