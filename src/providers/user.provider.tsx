import React, {createContext, useState, useEffect, useContext} from 'react'
import {isBefore} from 'date-fns'

import {Patient, BloodPressure, Medication, BloodSugar} from '../models'
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
  bloodSugars: BloodSugar[] | undefined
  hasLoadedOfflineData: boolean
  setPatientData: (patientData: PatientResponseData) => any
  updatePatientBloodPressureData: (bloodPressures: BloodPressure[]) => any
  user: Patient | undefined
}

export const UserContext = createContext<Partial<ContextProps>>({
  user: undefined,
  bloodPressures: undefined,
  medications: undefined,
  bloodSugars: undefined,
  hasLoadedOfflineData: false,
  setPatientData: async (patientData: Patient) => {
    return true
  },
  updatePatientBloodPressureData: async (bloodPressures: BloodPressure[]) => {
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
  const [bloodSugars, setBloodSugars] = useState<BloodSugar[] | undefined>(
    undefined,
  )
  const [medications, setMedications] = useState<Medication[] | undefined>(
    undefined,
  )
  const [hasLoadedOfflineData, setHasLoadedOfflineData] = useState<boolean>(
    false,
  )

  // Sorts the blood pressures by latest dates first and then sets them
  const sortDatesThenSetBloodPressures = (bloodPressures: BloodPressure[]) => {
    setBloodPressures(
      bloodPressures.sort((a: BloodPressure, b: BloodPressure) => {
        return isBefore(
          new Date(a.recorded_at ?? ''),
          new Date(b.recorded_at ?? ''),
        )
          ? 1
          : -1
      }),
    )
  }

  const setPatientData = async (patientResponseData: PatientResponseData) => {
    const {
      patient_id,
      full_name,
      password_digest,
      blood_pressures,
      medications,
      blood_sugars,
    } = patientResponseData
    const userData = {patient_id, full_name, password_digest}
    const bloodPressuresData = [
      ...blood_pressures,
      ...(bloodPressures ?? []).filter((bp) => bp.offline),
    ]
    const medicationsData = [...medications]

    setUser(userData)
    sortDatesThenSetBloodPressures(bloodPressuresData)
    setMedications(medicationsData)
    setBloodSugars([...blood_sugars])

    try {
      writeItemToDisk(userData, KEYS.USER)
      writeItemsToDisk(bloodPressuresData, KEYS.BLOOD_PRESSURES)
      writeItemsToDisk(medicationsData, KEYS.MEDICATIONS)
    } catch (error) {
      // Error getting data
    }
    return true
  }

  const updatePatientBloodPressureData = async (
    bloodPressures: BloodPressure[],
  ) => {
    const bloodPressuresData = [...bloodPressures]
    sortDatesThenSetBloodPressures(bloodPressuresData)

    try {
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
          setUser(userData)
        }

        const bloodPressuresData = await readItemsFromDisk(KEYS.BLOOD_PRESSURES)
        if (bloodPressuresData) {
          sortDatesThenSetBloodPressures(bloodPressuresData)
        }

        const medicationsData = await readItemsFromDisk(KEYS.MEDICATIONS)
        if (medicationsData) {
          setMedications(medicationsData)
        }
      } catch (error) {
        // Error getting data
        console.log('initFromOfflineCache error ', error)
      } finally {
        setTimeout(() => {
          setHasLoadedOfflineData(true)
        }, 0)
      }
    }
    initFromOfflineCache()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        bloodPressures,
        medications,
        setPatientData,
        updatePatientBloodPressureData,
        hasLoadedOfflineData,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
