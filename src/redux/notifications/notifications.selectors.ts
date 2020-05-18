/* eslint-disable react-hooks/rules-of-hooks */
import {useSelector} from 'react-redux'
import {RootState} from '../store'

export const pushNotificationPermissionSelector = () => {
  return useSelector(
    (state: RootState) => state.notifications.pushNotificationPermission,
  )
}

export const devicePushTokenSelector = () => {
  return useSelector((state: RootState) => state.notifications.devicePushToken)
}
