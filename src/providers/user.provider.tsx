import React, {createContext, useState, useEffect, useContext} from 'react'
import {Patient, BloodPressure} from '../models'
import {PatientResponseData} from '../api/patient'
import {
  writeItemToDisk,
  writeItemsToDisk,
  readItemFromDisk,
  readItemsFromDisk,
} from '../offline/database'

const KEYS = {
  USER: 'user',
  BLOOD_PRESSURES: 'bloodPressures',
}

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

  // const [test, setTest] = useState(false)

  const updatePatientData = async (
    patientResponseData: PatientResponseData,
  ) => {
    const {
      patient_id,
      full_name,
      password_digest,
      blood_pressures,
    } = patientResponseData
    const userData = {patient_id, full_name, password_digest}
    const bloodPressuresData = blood_pressures.slice()
    setUser(userData)
    setBloodPressures(bloodPressuresData)

    try {
      writeItemToDisk(userData, KEYS.USER)
      writeItemsToDisk(bloodPressuresData, KEYS.BLOOD_PRESSURES)
    } catch (error) {
      // Error getting data
    }
    return true
  }

  useEffect(() => {
    const initFromOfflineCache = async () => {
      try {
        const userData = await readItemFromDisk(KEYS.USER)
        if (userData) {
          // console.log('userData from cache', userData)
          setUser(userData)
          // setTest(true)
        }

        const bloodPressuresData = await readItemsFromDisk(KEYS.BLOOD_PRESSURES)
        // console.log('bloodPressuresData from cache', bloodPressuresData)
        if (bloodPressuresData) {
          setBloodPressures(bloodPressuresData)
        }
      } catch (error) {
        // Error getting data
        console.log('huh? ', error)
      }
    }
    initFromOfflineCache()
  }, [])

  useEffect(() => {
    // console.log('bloodPressures changed: ', bloodPressures)
  }, [user, bloodPressures])

  return (
    <UserContext.Provider value={{user, bloodPressures, updatePatientData}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
