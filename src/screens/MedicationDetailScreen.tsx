import React, {useState, useRef, ReactChild, ReactNode, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  Text,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage, useIntl} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotificationAndroid from 'react-native-push-notification'
import {format} from 'date-fns'
import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {useThunkDispatch} from '../redux/store'
import {
  addMedication,
  updateMedication,
  deleteMedication,
  refreshAllLocalPushReminders,
} from '../redux/medication/medication.actions'
import {BodyText, BodyHeader, Button} from '../components'
import {medicationsLibrarySelector} from '../redux/medication/medication.selectors'
import PushNotifications, {scheduleNotif} from '../notifications'
import {Permission} from '../redux/notifications/notifications.models'

import {
  createAReminder,
  DAILY,
  WEEK_DAYS,
  WEEKENDS,
  Day,
  frequencyText,
  dateForDayOffset,
} from '../redux/medication/medication.models'
import {
  devicePushTokenSelector,
  pushNotificationPermissionSelector,
} from '../redux/notifications/notifications.selectors'
import {setPushNotificationPermission} from '../redux/notifications/notifications.actions'

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

function Row({children, style}: {children: ReactNode; style?: any}) {
  return <View style={[styles.row, {...style}]}>{children}</View>
}

function MedicationDetailsScreen({navigation, route}: Props) {
  const intl = useIntl()
  const dispatch = useThunkDispatch()

  const [remindersEnabled, setRemindersEnabled] = useState(
    route.params.medication.reminder !== undefined,
  )

  const {isEditing} = route.params

  const [recurringReminders, setRecurringReminders] = useState(false)
  const [medication, setMedication] = useState(route.params.medication)
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

  const updateDays = (days: string) => {
    setReminder({...reminder, days})
  }

  const updateDayOffset = (dayOffset: number) => {
    setReminder({...reminder, dayOffset})
  }

  const reminderDate = dateForDayOffset(reminder.dayOffset)

  useEffect(() => {
    if (remindersEnabled) {
      if (
        pushNotificationPermission === Permission.PermissionNotDetermined ||
        devicePushToken === 'None'
      ) {
        if (Platform.OS === 'ios') {
          const askForIosPermissions = () => {
            PushNotificationIOS.requestPermissions().then(
              (data) => {
                if (data.alert) {
                  dispatch(
                    setPushNotificationPermission(
                      Permission.PermissionPermitted,
                    ),
                  )
                } else {
                  /*
                  setRemindersEnabled(false)
                  */
                  // should we allow a reminder to be 'on' when we can't push to the user?
                  dispatch(
                    setPushNotificationPermission(Permission.PermissionDenied),
                  )
                }
              },
              (data) => {
                console.log(
                  'PushNotificationIOS.requestPermissions failed',
                  data,
                )
              },
            )
          }

          if (
            pushNotificationPermission === Permission.PermissionNotDetermined
          ) {
            navigation.navigate(SCREENS.ALLOW_NOTIFICATIONS_MODAL_SCREEN, {
              okCallback: () => {
                askForIosPermissions()
              },
              cancelCallback: () => {
                setRemindersEnabled(false)
              },
            })
          } else {
            askForIosPermissions()
          }
        } else if (Platform.OS === 'android') {
          if (devicePushToken === 'None') {
            PushNotificationAndroid.requestPermissions()
          }
        }
      }
    }
  }, [remindersEnabled])

  const saveOrUpdate = () => {
    const toSave = {...medication}
    if (remindersEnabled) {
      toSave.reminder = reminder
    } else {
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
    <SafeAreaView style={[containerStyles.fill]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[containerStyles.containerSegment]}>
          <Row>
            <BodyHeader>
              <FormattedMessage id="medicine.reminder" />
            </BodyHeader>
            <Switch
              trackColor={{false: colors.grey4, true: colors.blue3}}
              thumbColor={remindersEnabled ? colors.blue2 : colors.grey3}
              onValueChange={() => {
                setRemindersEnabled(!remindersEnabled)
              }}
              value={remindersEnabled}
            />
          </Row>
          {remindersEnabled && (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate(SCREENS.MEDICATION_FREQUENCY, {
                    updateDays,
                    reminder,
                  })
                }}>
                <View
                  style={[
                    styles.row,
                    {
                      borderBottomWidth: 2,
                      borderColor: colors.grey4,
                      paddingVertical: 12,
                    },
                  ]}>
                  <BodyText>
                    <FormattedMessage id="medicine.frequency" />
                  </BodyText>
                  <View style={{flexDirection: 'row'}}>
                    <BodyText style={{color: colors.blue2, marginRight: 16}}>
                      <FormattedMessage id={frequencyText(reminder.days)} />
                    </BodyText>
                    <Icon
                      name="chevron-right"
                      size={24}
                      style={{marginLeft: 'auto'}}
                      color={colors.blue2}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate(SCREENS.MEDICATION_TIME, {
                    updateDayOffset,
                    reminder,
                  })
                }}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingTop: 12,
                    },
                  ]}>
                  <BodyText>
                    <FormattedMessage id="medicine.time" />
                  </BodyText>
                  <View style={{flexDirection: 'row'}}>
                    <BodyText style={{color: colors.blue2, marginRight: 16}}>
                      {format(reminderDate, 'h:mm a')}
                    </BodyText>
                    <Icon
                      name="chevron-right"
                      size={24}
                      style={{marginLeft: 'auto'}}
                      color={colors.blue2}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
        {debugPush && (
          <View style={[containerStyles.containerSegment]}>
            <Row>
              <BodyHeader style={{marginBottom: 15}}>Push Stuff</BodyHeader>
            </Row>
            <Row style={{marginBottom: 15}}>
              <BodyText style={{flex: 1}}>Push permissions:</BodyText>
              <BodyText>{pushPermission}</BodyText>
            </Row>
            <Row>
              <BodyText style={{flex: 1}}>Device token:</BodyText>
            </Row>
            {devicePushToken && (
              <Row>
                <BodyText style={{flex: 1}}>{devicePushToken}</BodyText>
              </Row>
            )}
          </View>
        )}

        {isEditing && medication.offline && (
          <Button
            style={{
              backgroundColor: colors.grey4,
            }}
            buttonColor={colors.red1}
            disableBoxShadow
            title={intl.formatMessage({id: 'medicine.delete-medicine'})}
            onPress={() => {
              Alert.alert(
                intl.formatMessage({id: 'medicine.delete-medicine'}),
                intl.formatMessage({id: 'medicine.delete-confirm'}),
                [
                  {
                    text: intl.formatMessage({id: 'general.cancel'}),
                  },
                  {
                    text: intl.formatMessage({id: 'general.delete'}),
                    style: 'destructive',
                    onPress: () => {
                      dispatch(deleteMedication(medication))
                      navigation.popToTop()
                    },
                  },
                ],
                {cancelable: true},
              )
            }}
          />
        )}
        <Button
          style={{marginHorizontal: 8, marginTop: 'auto'}}
          title={intl.formatMessage({id: 'general.save'})}
          onPress={() => {
            saveOrUpdate()
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default MedicationDetailsScreen

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 8,
    flex: 1,
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
