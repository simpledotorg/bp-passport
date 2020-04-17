import React, {createContext, useState, useEffect, useContext} from 'react'
import {Patient, BloodPressure} from '../models'
import {PatientResponseData} from '../api/patient'

type ContextProps = {
  bloodPressures: BloodPressure[]
  updatePatientData: (patientData: PatientResponseData) => any
  user: Patient | undefined
}

export const UserContext = createContext<Partial<ContextProps>>({
  user: undefined,
  bloodPressures: [],
  updatePatientData: async (patientData: Patient) => {
    return true
  },
})

export interface IProps {
  children: any
}

const UserProvider = ({children}: IProps) => {
  const [user, setUser] = useState<Patient | undefined>(undefined)
  const [bloodPressures, setBloodPressures] = useState<BloodPressure[]>([])

  const updatePatientData = async (
    patientResponseData: PatientResponseData,
  ) => {
    // Todo - write/update patient offline
    // Todo - write/update blood pressures offline
    const {
      patient_id,
      full_name,
      password_digest,
      blood_pressures,
    } = patientResponseData
    setUser({patient_id, full_name, password_digest})
    setBloodPressures(blood_pressures.slice())
    return true
  }

  return (
    <UserContext.Provider value={{user, bloodPressures, updatePatientData}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
