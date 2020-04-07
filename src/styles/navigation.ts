import {StyleSheet} from 'react-native'
import colors from './colors'

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.blue1,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.white100,
  },
  userNameHeaderTitleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontFamily: 'Roboto',
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.white100,
  },
})

export default styles
