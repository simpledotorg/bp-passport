import AsyncStorage from '@react-native-community/async-storage'

export const writeItemToDisk = async (item: any, key: string) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item))
    return true
  } catch (error) {
    // Error saving data
    throw error
  }
}

export const readItemFromDisk = async (key: string) => {
  try {
    const diskData = await AsyncStorage.getItem(key)
    if (diskData !== null) {
      const parseData = await JSON.parse(diskData)
      return parseData as any
    }
  } catch (error) {
    // Error getting data
    throw error
  }
}

export const writeItemsToDisk = async (items: any[], key: string) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(items))

    // await AsyncStorage.mergeItem(key, JSON.stringify(items))
    return true
  } catch (error) {
    // Error saving data
    throw error
  }
}

export const readItemsFromDisk = async (key: string) => {
  try {
    const diskData = await AsyncStorage.getItem(key)
    if (diskData !== null) {
      const parseData = await JSON.parse(diskData)
      return parseData as any[]
    }
  } catch (error) {
    // Error getting data
    throw error
  }
}
