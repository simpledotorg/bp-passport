import React, {useState, useRef, ReactChild, ReactNode, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage, useIntl} from 'react-intl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {format} from 'date-fns'

import {containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {useThunkDispatch} from '../redux/store'
import {BodyText, BodyHeader, Button} from '../components'
import {medicationsLibrarySelector} from '../redux/medication/medication.selectors'
import PushNotifications, {scheduleNotif} from '../notifications'

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

function Row({children}: {children: ReactNode}) {
  return <View style={styles.row}>{children}</View>
}

function MedicationDetailsScreen({navigation, route}: Props) {
  const intl = useIntl()
  const [remindersEnabled, setRemindersEnabled] = useState(false)
  /*
  const toggleReminders = () => {
    const enable = !remindersEnabled
    setRemindersEnabled(enable)
    if (enable) {
      PushNotifications.requestPermissions((permissions) => {
        console.log('Permissions completed: ', permissions)
        console.log('Schedule it!')

        scheduleNotif()
      
        PushNotifications.localNotification({
          message: 'My Notification Message',
        })
      
        PushNotifications.localNotificationSchedule({
          // ... You can use all the options from localNotifications
          message: 'My Notification Message', // (required)
          date: new Date(Date.now() + 20 * 1000), // in 60 secs
        }) 
      })
    }
  }
  */

  const [recurringReminders, setRecurringReminders] = useState(false)
  const [medication, setMedication] = useState(route.params.medication)

  const updateDays = (days: any) => {
    setMedication({...medication, days})
  }

  const updateTime = (time: Date) => {
    setMedication({...medication, time})
  }

  const getFrequencyText = () => {
    if (!medication.days) {
      return 'medicine.daily'
    }

    const onDays = (Object.keys(medication.days) ?? []).filter((day) => {
      return medication.days[day].value
    })

    if (onDays.length === 7) {
      return 'medicine.daily'
    } else if (onDays.length === 1) {
      return `general.${onDays[0].toLowerCase()}`
    }

    return 'medicine.custom'
  }

  useEffect(() => {
    if (remindersEnabled) {
      if (Platform.OS === 'ios') {
        PushNotifications.requestPermissions((permissions) => {
          console.log('Permissions completed on iOS: ', permissions)
          scheduleNotif()
        })
      } else {
        console.log('on android so no permissions required')
        scheduleNotif()
      }
    }
  }, [remindersEnabled])

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
                    medication,
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
                      <FormattedMessage id={getFrequencyText()} />
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
                    updateTime,
                    medication,
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
                      {format(medication.time ?? new Date(), 'HH:mm')}
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
        <View style={[containerStyles.containerSegment]}>
          <Row>
            <BodyHeader>
              <FormattedMessage id="medicine.recurring-reminders" />
            </BodyHeader>
            <Switch
              trackColor={{false: colors.grey4, true: colors.blue3}}
              thumbColor={recurringReminders ? colors.blue2 : colors.grey3}
              onValueChange={() => {
                setRecurringReminders(!recurringReminders)
              }}
              value={recurringReminders}
            />
          </Row>
          <BodyText style={{color: colors.grey1, fontSize: 16, marginTop: 18}}>
            <FormattedMessage id="medicine.will-be-reminded" />
          </BodyText>
        </View>
        <Button
          style={{marginHorizontal: 8, marginTop: 'auto'}}
          title={intl.formatMessage({id: 'general.save'})}
          onPress={() => {}}
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
