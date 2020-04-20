import React, {createContext, useState, useEffect, useContext} from 'react'
import {Patient, BloodPressure, Medication} from '../models'
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
  MEDICATIONS: 'medications',
}

type ContextProps = {
  bloodPressures: BloodPressure[] | undefined
  medications: Medication[] | undefined
  updatePatientData: (patientData: PatientResponseData) => any
  user: Patient | undefined
}

export const UserContext = createContext<Partial<ContextProps>>({
  user: undefined,
  bloodPressures: undefined,
  medications: undefined,
  updatePatientData: async (patientData: Patient) => {
    return true
  },
})

export interface IProps {
  children: any
}

const UserProvider = ({children}: IProps) => {
  const [user, setUser] = useState<Patient | undefined>(undefined)
  const [bloodPressures, setBloodPressures] = useState<
    BloodPressure[] | undefined
  >(undefined)

  const [medications, setMedications] = useState<Medication[] | undefined>(
    undefined,
  )

  const updatePatientData = async (
    patientResponseData: PatientResponseData,
  ) => {
    const {
      patient_id,
      full_name,
      password_digest,
      blood_pressures,
      medications,
    } = patientResponseData
    const userData = {patient_id, full_name, password_digest}
    const bloodPressuresData = [...blood_pressures]
    const medicationsData = [...medications]
    setUser(userData)
    setBloodPressures(bloodPressuresData)
    setMedications(medicationsData)

    try {
      writeItemToDisk(userData, KEYS.USER)
      writeItemsToDisk(bloodPressuresData, KEYS.BLOOD_PRESSURES)
      writeItemsToDisk(medicationsData, KEYS.MEDICATIONS)
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
          setUser(userData)
        }

        const bloodPressuresData = await readItemsFromDisk(KEYS.BLOOD_PRESSURES)
        if (bloodPressuresData) {
          setBloodPressures(bloodPressuresData)
        }

        const medicationsData = await readItemsFromDisk(KEYS.MEDICATIONS)
        if (medicationsData) {
          setMedications(medicationsData)
        }
      } catch (error) {
        // Error getting data
        console.log('initFromOfflineCache error ', error)
      }
    }
    initFromOfflineCache()
  }, [])

  return (
    <UserContext.Provider
      value={{user, bloodPressures, medications, updatePatientData}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
