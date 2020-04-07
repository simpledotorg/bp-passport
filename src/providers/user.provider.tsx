import React, {createContext, useState, useEffect, useContext} from 'react'
import {User} from '../models'

const initialUserState: User | undefined = {
  id: 'example',
  full_name: 'Anish Acharya',
  password_digest: '123 4567',
}

type ContextProps = {
  user: User | undefined
}

export const UserContext = createContext<Partial<ContextProps>>({
  user: undefined,
})

export interface IProps {
  children: any
}

const UserProvider = ({children}: IProps) => {
  const [user, setUser] = useState<User | undefined>(initialUserState)

  return <UserContext.Provider value={{user}}>{children}</UserContext.Provider>
}

export default UserProvider
