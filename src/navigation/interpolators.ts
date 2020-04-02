import {StackCardInterpolationProps} from '@react-navigation/stack'

const forFade = ({current}: StackCardInterpolationProps) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

export {forFade}
