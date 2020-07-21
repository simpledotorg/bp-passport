import {Dimensions} from 'react-native'

export const isSmallDevice = () => {
  return Dimensions.get('window').width <= 320
}
