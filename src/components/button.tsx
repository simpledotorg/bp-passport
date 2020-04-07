import React from 'react'
import {TouchableOpacity, Text} from 'react-native'

import colors from '../styles/colors'

export const Button = (props: any) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          ...props.style,
          height: 48,
          borderRadius: 2,
          backgroundColor: colors.blue2,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: 'rgba(0,0,0, 0.8)', // iOS box shadow
          shadowOffset: {height: 1, width: 1}, // iOS box shadow
          shadowOpacity: 1, // iOS box shadow
          shadowRadius: 1, // iOS box shadow
          elevation: 2, // Android elevation
        },
      ]}>
      {props.title && (
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: '500',
              fontStyle: 'normal',
              lineHeight: 20,
              letterSpacing: 1.25,
              color: colors.white100,
              textTransform: 'uppercase',
            },
          ]}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  )
}
