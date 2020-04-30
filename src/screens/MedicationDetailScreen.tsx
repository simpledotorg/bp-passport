import React, {useState, useRef, ReactChild, ReactNode} from 'react'
import {SafeAreaView, View, StyleSheet, ScrollView, Switch} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useIntl, FormattedMessage} from 'react-intl'
import {containerStyles, colors} from '../styles'

import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'

import {useThunkDispatch} from '../redux/store'
import {BodyText, BodyHeader} from '../components'
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
  const dispatch = useThunkDispatch()
  const [remindersEnabled, setRemindersEnabled] = useState(false)
  const toggleReminders = () => {
    const enable = !remindersEnabled
    setRemindersEnabled(enable)
    if (enable) {
      PushNotifications.requestPermissions((permissions) => {
        console.log('Permissions completed: ', permissions)
        console.log('Schedule it!')

        scheduleNotif()
        /*
        PushNotifications.localNotification({
          message: 'My Notification Message',
        })
      
        PushNotifications.localNotificationSchedule({
          // ... You can use all the options from localNotifications
          message: 'My Notification Message', // (required)
          date: new Date(Date.now() + 20 * 1000), // in 60 secs
        }) */
      })
    }
  }
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
              onValueChange={toggleReminders}
              value={remindersEnabled}
            />
          </Row>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MedicationDetailsScreen

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
