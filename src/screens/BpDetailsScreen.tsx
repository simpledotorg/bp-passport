import React from 'react'
import {SafeAreaView, View, StyleSheet, Alert} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {format} from 'date-fns'
import {FormattedMessage, useIntl} from 'react-intl'

import {containerStyles, colors, navigation} from '../styles'
import {BodyText, Button} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BloodPressure} from '../models'

type BpDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.BP_HISTORY
>

type BpDetailsScreen = RouteProp<RootStackParamList, SCREENS.BP_DETAILS>

type Props = {
  navigation: BpDetailsScreenNavigationProp
  route: BpDetailsScreen
}

function BpDetailsScreen({navigation, route}: Props) {
  const intl = useIntl()
  const {bp}: {bp: BloodPressure} = route.params

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  const displayDate = (bpIn: BloodPressure) => {
    return bpIn.recorded_at
      ? format(
          new Date(bpIn.recorded_at),
          `dd-MMM-yyy '${intl.formatMessage({id: 'general.at'})}' hh:mm`,
        )
      : null
  }

  const getBPText = () => {
    return isBloodPressureHigh(bp) ? (
      <BodyText
        style={[
          styles.bpText,
          {
            color: colors.red1,
          },
        ]}>
        <FormattedMessage id="general.high-bp" />
      </BodyText>
    ) : (
      <BodyText
        style={[
          styles.bpText,
          {
            color: colors.green1,
          },
        ]}>
        <FormattedMessage id="general.normal-bp" />
      </BodyText>
    )
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <View style={{padding: 24}}>
          <BodyText style={styles.bpBold}>
            {`${bp.systolic} / ${bp.diastolic}, `}
            {getBPText()}
          </BodyText>
          <BodyText style={styles.bpTag}>
            <FormattedMessage id="general.bp" />
          </BodyText>
          <BodyText style={[styles.bpBold, {marginTop: 16}]}>
            {displayDate(bp)}
          </BodyText>
          <BodyText style={styles.bpTag}>
            <FormattedMessage id="general.date" />
          </BodyText>
          {bp.facility && (
            <>
              <BodyText style={[styles.bpBold, {marginTop: 16}]}>
                {bp.facility.name}
              </BodyText>
              <BodyText style={styles.bpTag}>
                <FormattedMessage id="general.added-at" />
              </BodyText>
            </>
          )}

          {bp.offline && (
            <Button
              style={{
                marginTop: 24,
                backgroundColor: colors.blue3,
                shadowColor: 'rgba(0, 117, 235, 0.3)',
              }}
              buttonColor={colors.blue2}
              title={intl.formatMessage({id: 'general.delete-bp'})}
              onPress={() => {
                Alert.alert(
                  intl.formatMessage({id: 'general.delete-bp'}),
                  intl.formatMessage({id: 'general.delete-bp-confirm'}),
                  [
                    {
                      text: intl.formatMessage({id: 'general.cancel'}),
                    },
                    {
                      text: intl.formatMessage({id: 'general.ok'}),
                      onPress: () => {
                        // TODO: Trigger a request
                        navigation.goBack()
                      },
                    },
                  ],
                  {cancelable: true},
                )
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

export default BpDetailsScreen

const styles = StyleSheet.create({
  bpText: {
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 'auto',
    textAlign: 'center',
  },
  bpBold: {
    fontSize: 18,
    color: colors.grey0,
    fontWeight: '500',
  },
  bpTag: {
    color: colors.grey1,
    fontSize: 14,
  },
})
