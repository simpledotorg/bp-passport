import React from 'react'
import {Text} from 'react-native'

import {colors} from '../styles'

export const PageHeader = (props: any) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 20,
          fontWeight: '500',
          fontStyle: 'normal',
          lineHeight: 28,
          letterSpacing: 0.2,
          color: colors.grey0,
          ...props.style,
        },
      ]}
    />
  )
}
