import { StyleSheet } from 'react-native'
import colors from './colors'

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.blue1,
    shadowOffset: { height: 0, width: 0 },
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.white100,
  },
  homeHeaderTitleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontFamily: 'RobotoBold',
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.white100,
  },
  homeSubHeaderTitleStyle: {
    fontSize: 16,
    fontStyle: 'normal',
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
    color: colors.white100,
    opacity: 0.5,
    marginTop: 8,
  },
})

export default styles
