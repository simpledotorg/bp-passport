import { StyleSheet } from 'react-native'
import colors from './colors'

const styles = StyleSheet.create({
  fill: { flex: 1 },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    padding: 12,
    textAlign: 'center',
  },
  containerSegment: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 18,
    marginBottom: 8,
    flexShrink: 0,
    padding: 24,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  carouselSegment: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 18,
    marginBottom: 8,
    flexShrink: 0,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default styles
