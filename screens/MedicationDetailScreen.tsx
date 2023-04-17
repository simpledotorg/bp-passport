import React, { useState, ReactNode, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  Switch,
  TouchableHighlight,
  Alert,
  Platform,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FormattedMessage, useIntl } from 'react-intl'
import { MaterialIcons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { containerStyles, colors } from '../styles'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'

import { RootState, useThunkDispatch } from '../redux/store'
import {
  addMedication,
  updateMedication,
  deleteMedication,
} from '../redux/medication/medication.actions'
import { BodyText, BodyHeader, Button, Line, ButtonType } from '../components'
import { Permission } from '../redux/notifications/notifications.models'
import { useDispatch, useSelector } from 'react-redux'
import { medicationScheduleSlice } from '../redux/slices/medicationScheduleSlice'
import useSetNotificationsSchedule from '../hooks/useSetNotificationsSchedule'

import {
  createAReminder,
  frequencyText,
  dateForDayOffset,
} from '../redux/medication/medication.models'
import {
  devicePushTokenSelector,
  pushNotificationPermissionSelector,
} from '../redux/notifications/notifications.selectors'
import { setPushNotificationPermission } from '../redux/notifications/notifications.actions'
import { dateLocale } from '../constants/languages'
import { cancelNotification } from '../notification'
import * as Notifications from 'expo-notifications'
import {
  AndroidImportance,
  setNotificationChannelAsync,
} from 'expo-notifications'

type MedicationDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.MEDICATION_DETAILS
>

type MedicationDetailsScreen = RouteProp<
  RootStackParamList,
  SCREENS.MEDICATION_DETAILS
>

type Props = {
  navigation: MedicationDetailsScreenNavigationProp
  route: MedicationDetailsScreen
}

function Row({ children, margin }: { children: ReactNode; margin?: number }) {
  return (
    <View style={[styles.row, { marginBottom: margin ? margin : 0 }]}>
      {children}
    </View>
  )
}

function MedicationDetailsScreen({ navigation, route }: Props) {
  const intl = useIntl()
  const dispatch = useThunkDispatch()

  const [remindersEnabled, setRemindersEnabled] = useState(
    route.params.medication.reminder !== undefined,
  )
  const setNotificationsSchedule = useSetNotificationsSchedule()
  const { isEditing } = route.params

  const { MedicationSchedule } = useSelector(
    (state: RootState) => state.medicationSchedule,
  )
  const { setDeleteMedicationSchedule } = medicationScheduleSlice.actions
  const dispatchRedux = useDispatch()

  const [medication] = useState(route.params.medication)
  const [reminder, setReminder] = useState(
    route.params.medication.reminder ?? createAReminder(),
  )

  const devicePushToken = devicePushTokenSelector() ?? 'None'
  const pushNotificationPermission = pushNotificationPermissionSelector()

  let pushPermission = 'Not determined'
  switch (pushNotificationPermission) {
    case Permission.PermissionPermitted:
      pushPermission = 'Granted'
      break
    case Permission.PermissionDenied:
      pushPermission = 'Denied'
      break
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      setNotificationChannelAsync('default', {
        name: 'default',
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      })
    }
  }, [])

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!')
      dispatch(setPushNotificationPermission(Permission.PermissionDenied))
      return
    }
    if (finalStatus === 'granted') {
      dispatch(setPushNotificationPermission(Permission.PermissionPermitted))
      return
    }
  }

  useEffect(() => {
    if (remindersEnabled) {
      if (pushNotificationPermission === Permission.PermissionNotDetermined) {
        navigation.navigate(SCREENS.ALLOW_NOTIFICATIONS_MODAL_SCREEN, {
          okCallback: () => {
            registerForPushNotificationsAsync()
          },
          cancelCallback: () => {
            setRemindersEnabled(false)
          },
        })
      } else {
        registerForPushNotificationsAsync()
      }
    }
  }, [])

  const updateDays = (days: string) => {
    setReminder({ ...reminder, days })
  }

  const updateDayOffset = (dayOffset: number) => {
    setReminder({ ...reminder, dayOffset })
  }

  const reminderDate = dateForDayOffset(reminder.dayOffset)
  const deleteNotificationsSchedule = (medicationToDelete: string) => {
    const filteredSchedules = MedicationSchedule.filter(
      (schedule) => schedule.medication === medicationToDelete,
    )

    filteredSchedules.forEach((schedule) =>
      cancelNotification(schedule.schedule),
    )
    dispatchRedux(setDeleteMedicationSchedule(medicationToDelete))
  }

  const saveOrUpdate = () => {
    const toSave = { ...medication }

    if (remindersEnabled) {
      toSave.reminder = reminder
      if (!isEditing) {
        setNotificationsSchedule(
          reminder,
          toSave.name,
          toSave.createdAt ? toSave.createdAt : null,
        )
      } else {
        deleteNotificationsSchedule(
          toSave.createdAt
            ? `${toSave.name}${toSave.createdAt}`
            : `${toSave.name}`,
        )
        setNotificationsSchedule(
          reminder,
          toSave.name,
          toSave.createdAt ? toSave.createdAt : null,
        )
      }
    } else {
      deleteNotificationsSchedule(
        toSave.createdAt
          ? `${toSave.name}${toSave.createdAt}`
          : `${toSave.name}`,
      )
      delete toSave.reminder
    }

    if (isEditing) {
      dispatch(updateMedication(toSave))
    } else {
      dispatch(addMedication(toSave))
    }

    navigation.popToTop()
  }

  const debugPush = false

  return (
    <SafeAreaView
      style={[containerStyles.fill, { backgroundColor: colors.blue3 }]}
    >
      <View style={[containerStyles.fill, { backgroundColor: colors.grey4 }]}>
        <View style={styles.container}>
          <View
            style={[
              containerStyles.containerSegment,
              {
                paddingHorizontal: 24,
                padding: 0,
                paddingTop: 16,
                paddingBottom: remindersEnabled ? 8 : 0,
              },
            ]}
          >
            <Row margin={16}>
              <BodyHeader>
                <FormattedMessage id="medicine.reminder" />
              </BodyHeader>
              <Switch
                trackColor={{
                  false: colors.grey4,
                  true: colors.blue3,
                }}
                thumbColor={remindersEnabled ? colors.blue2 : colors.grey3}
                onValueChange={() => {
                  setRemindersEnabled(!remindersEnabled)
                }}
                value={remindersEnabled}
              />
            </Row>
            {remindersEnabled && (
              <>
                <TouchableHighlight
                  underlayColor={colors.grey4}
                  onPress={() => {
                    navigation.navigate(SCREENS.MEDICATION_FREQUENCY, {
                      updateDays,
                      reminder,
                    })
                  }}
                  style={{
                    marginHorizontal: -24,
                    paddingHorizontal: 24,
                  }}
                >
                  <View
                    style={[
                      styles.row,
                      {
                        height: 48,
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <BodyText style={{ flex: 1, marginRight: 10 }}>
                      <FormattedMessage id="medicine.frequency" />
                    </BodyText>
                    <View style={{ flexDirection: 'row' }}>
                      <BodyText
                        style={{
                          color: colors.blue2,
                          marginRight: 16,
                        }}
                      >
                        <FormattedMessage id={frequencyText(reminder.days)} />
                      </BodyText>
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        style={{ marginLeft: 'auto' }}
                        color={colors.blue2}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
                <Line />
                <TouchableHighlight
                  underlayColor={colors.grey4}
                  onPress={() => {
                    navigation.navigate(SCREENS.MEDICATION_TIME, {
                      updateDayOffset,
                      reminder,
                    })
                  }}
                  style={{
                    marginHorizontal: -24,
                    paddingHorizontal: 24,
                  }}
                >
                  <View
                    style={[
                      styles.row,
                      {
                        height: 48,
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <BodyText style={{ flex: 1, marginRight: 10 }}>
                      <FormattedMessage id="medicine.time" />
                    </BodyText>
                    <View style={{ flexDirection: 'row' }}>
                      <BodyText
                        style={{
                          color: colors.blue2,
                          marginRight: 16,
                        }}
                      >
                        {format(reminderDate, 'h:mm a', {
                          locale: dateLocale(),
                        })}
                      </BodyText>
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        style={{ marginLeft: 'auto' }}
                        color={colors.blue2}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
              </>
            )}
          </View>
          {debugPush && (
            <View style={[containerStyles.containerSegment]}>
              <Row>
                <BodyHeader style={{ marginBottom: 15 }}>Push Stuff</BodyHeader>
              </Row>
              <Row margin={15}>
                <BodyText style={{ flex: 1 }}>Push permissions:</BodyText>
                <BodyText>{pushPermission}</BodyText>
              </Row>
              <Row>
                <BodyText style={{ flex: 1 }}>Device token:</BodyText>
              </Row>
              {devicePushToken && (
                <Row>
                  <BodyText style={{ flex: 1 }}>{devicePushToken}</BodyText>
                </Row>
              )}
            </View>
          )}

          {isEditing && medication.offline && (
            <Button
              style={{
                marginTop: 22,
              }}
              buttonType={ButtonType.Delete}
              title={intl.formatMessage({
                id: 'medicine.delete-medicine',
              })}
              onPress={() => {
                Alert.alert(
                  intl.formatMessage({
                    id: 'medicine.delete-medicine',
                  }),
                  intl.formatMessage({
                    id: 'medicine.delete-confirm',
                  }),
                  [
                    {
                      text: intl.formatMessage({
                        id: 'general.cancel',
                      }),
                    },
                    {
                      text: intl.formatMessage({
                        id: 'general.delete',
                      }),
                      style: 'destructive',
                      onPress: () => {
                        deleteNotificationsSchedule(
                          medication.createdAt
                            ? `${medication.name}${medication.createdAt}`
                            : `${medication.name}`,
                        )

                        dispatch(deleteMedication(medication))
                        navigation.popToTop()
                      },
                    },
                  ],
                  { cancelable: true },
                )
              }}
            />
          )}
        </View>
        <View
          style={{
            padding: 8,
            backgroundColor: colors.blue3,
          }}
        >
          <Button
            style={{ marginHorizontal: 8 }}
            buttonType={ButtonType.Normal}
            title={intl.formatMessage({ id: 'general.save' })}
            onPress={() => {
              saveOrUpdate()
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MedicationDetailsScreen

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 8,
    flex: 1,
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
