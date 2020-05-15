import {Animated} from 'react-native'
import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
  HeaderStyleInterpolators,
  TransitionPresets,
  TransitionSpecs,
} from '@react-navigation/stack'
const {add, multiply} = Animated
import {isIphoneX} from 'react-native-iphone-x-helper'
import {Platform, Easing} from 'react-native'

const forFade = ({current}: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

const forModalPresentationIOS = ({
  index,
  current,
  next,
  inverted,
  layouts: {screen},
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
        outputRange: [0, 0, isIphoneX() ? 38 : 0, 10],
      })
    : 10

  return {
    cardStyle: {
      overflow: 'hidden',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      marginTop: index === 0 ? 0 : statusBarHeight,
      marginBottom: index === 0 ? 0 : topOffset,
      transform: [{translateY}, {scale}],
    },
    overlayStyle: {opacity: overlayOpacity},
  }
}

const forRevealFromBottomAndroid = ({
  current,
  next,
  inverted,
  layouts: {screen},
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
      transform: [{translateY: containerTranslateY}],
    },
    cardStyle: {
      transform: [
        {translateY: cardTranslateYFocused},
        {translateY: cardTranslateYUnfocused},
      ],
    },
    overlayStyle: {opacity: overlayOpacity},
  }
}

const ScaleFromCenterAndroidSpec: any = {
  animation: 'timing',
  config: {
    duration: 200,
    // This is super rough approximation of the path used for the curve by android
    // See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing.bezier(0.35, 0.45, 0, 1),
  },
}

const forScaleFromCenterAndroid = ({
  current,
  next,
  closing,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const progress = add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1],
          extrapolate: 'clamp',
        })
      : 0,
  )

  const opacity = progress.interpolate({
    inputRange: [0, 0.8, 1, 1.2, 2],
    outputRange: [0, 0.5, 1, 0.33, 0],
  })

  const conditional = (
    condition: Animated.AnimatedInterpolation,
    main: Animated.AnimatedInterpolation,
    fallback: Animated.AnimatedInterpolation,
  ) => {
    // To implement this behavior, we multiply the main node with the condition.
    // So if condition is 0, result will be 0, and if condition is 1, result will be main node.
    // Then we multiple reverse of the condition (0 if condition is 1) with the fallback.
    // So if condition is 0, result will be fallback node, and if condition is 1, result will be 0,
    // This way, one of them will always be 0, and other one will be the value we need.
    // In the end we add them both together, 0 + value we need = value we need
    return add(
      multiply(condition, main),
      multiply(
        condition.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
        fallback,
      ),
    )
  }

  const scale = conditional(
    closing,
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
      extrapolate: 'clamp',
    }),
    progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0.85, 1, 1.1],
    }),
  )

  return {
    containerStyle: {
      opacity,
      transform: [{scale}],
    },
  }
}

const ScaleFromCenterAndroid: any = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: ScaleFromCenterAndroidSpec,
    close: ScaleFromCenterAndroidSpec,
  },
  cardStyleInterpolator: forScaleFromCenterAndroid,
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
}

const ANDROID_VERSION_PIE = 28
const ANDROID_VERSION_Q = 29

const DefaultTransition = Platform.select({
  ios: TransitionPresets.SlideFromRightIOS,
  default:
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE
      ? Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_Q
        ? ScaleFromCenterAndroid
        : TransitionPresets.RevealFromBottomAndroid
      : TransitionPresets.FadeFromBottomAndroid,
})

export {
  forFade,
  forModalPresentationIOS,
  forRevealFromBottomAndroid,
  DefaultTransition,
}
