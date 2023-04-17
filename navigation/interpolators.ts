import { Animated } from 'react-native'
import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack'
const { add, multiply } = Animated

const forFade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

const forModalPresentationIOS = ({
  index,
  current,
  next,
  inverted,
  layouts: { screen },
  insets,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const isLandscape = screen.width > screen.height
  const topOffset = isLandscape ? 0 : 10
  const statusBarHeight = insets.top
  const aspectRatio = screen.height / screen.width

  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0,
  )

  const translateY = multiply(
    progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        screen.height,
        index === 0 ? 0 : topOffset,
        (index === 0 ? statusBarHeight : 0) - topOffset * aspectRatio,
      ],
    }),
    inverted,
  )

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0.5, 1, 1],
  })

  const scale = isLandscape
    ? 1
    : progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
          1,
          1,
          screen.width ? 1 - (topOffset * 2) / screen.width : 1,
        ],
      })

  const borderRadius = isLandscape
    ? 0
    : index === 0
    ? progress.interpolate({
        inputRange: [0, 1, 1.0001, 2],
        outputRange: [0, 0, 0, 10],
      })
    : 10

  return {
    cardStyle: {
      overflow: 'hidden',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      marginTop: index === 0 ? 0 : statusBarHeight,
      marginBottom: index === 0 ? 0 : topOffset,
      transform: [{ translateY }, { scale }],
    },
    overlayStyle: { opacity: overlayOpacity },
  }
}

const forRevealFromBottomAndroid = ({
  current,
  next,
  inverted,
  layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const containerTranslateY = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height, 0],
      extrapolate: 'clamp',
    }),
    inverted,
  )

  const cardTranslateYFocused = multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.height * (95.9 / 100) * -1, 0],
      extrapolate: 'clamp',
    }),
    inverted,
  )

  const cardTranslateYUnfocused = next
    ? multiply(
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screen.height * (2 / 100) * -1],
          extrapolate: 'clamp',
        }),
        inverted,
      )
    : 0

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 0.36, 1],
    outputRange: [0, 0.5, 0.5],
    extrapolate: 'clamp',
  })

  return {
    containerStyle: {
      overflow: 'hidden',
      transform: [{ translateY: containerTranslateY }],
    },
    cardStyle: {
      transform: [
        { translateY: cardTranslateYFocused },
        { translateY: cardTranslateYUnfocused },
      ],
    },
    overlayStyle: { opacity: overlayOpacity },
  }
}

export { forFade, forModalPresentationIOS, forRevealFromBottomAndroid }
