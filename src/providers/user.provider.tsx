import React, {createContext, useState, useEffect, useContext} from 'react'
import {Patient} from '../models'

/*
const initialUserState: User | undefined = {
  id: 'example',
  full_name: 'Anish Acharya',
  password_digest: '123 4567',
} */

type ContextProps = {
  user: Patient | undefined
  updatePatientData: (patientData: Patient) => any
}

export const UserContext = createContext<Partial<ContextProps>>({
  user: undefined,
  updatePatientData: async (patientData: Patient) => {
    return true
  },
})

export interface IProps {
  children: any
}

const UserProvider = ({children}: IProps) => {
  const [user, setUser] = useState<Patient | undefined>(undefined)

  const updatePatientData = async (patientData: Patient) => {
    // Todo - write patient to realm
    // Todo - write
    console.log('TODO > update offline patient and BPs')
    setUser(patientData)
    return true
  }

  return (
    <UserContext.Provider value={{user, updatePatientData}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
