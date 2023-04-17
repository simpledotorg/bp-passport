import React from 'react'
import { View, StyleSheet, TouchableHighlight } from 'react-native'
import { useIntl, FormattedMessage } from 'react-intl'
import { StackNavigationProp } from '@react-navigation/stack'

import { containerStyles, colors } from '../../styles'
import SCREENS from '../../constants/screens'
import { RootStackParamList } from '../../navigation/Navigation'
import {
  Button,
  Line,
  BodyHeader,
  BpInformation,
  ButtonType,
} from '../../components'

import { BloodPressure } from '../../redux/blood-pressure/blood-pressure.models'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type BPSProps = {
  navigation: HomeScreenNavigationProp
  bps: BloodPressure[]
  showList: number
}

type BPProps = {
  bp: BloodPressure
  showSeparator: boolean
  navigation: HomeScreenNavigationProp
}

const BloodPressureEntry = ({ bp, showSeparator, navigation }: BPProps) => {
  return (
    <>
      <TouchableHighlight
        underlayColor={colors.grey4}
        onPress={() => {
          navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
            bp,
          })
        }}
        style={[
          {
            paddingVertical: 12,
            marginHorizontal: -24,
            paddingHorizontal: 24,
          },
          styles.historyItem,
        ]}
      >
        <BpInformation bp={bp} />
      </TouchableHighlight>
      {showSeparator && <Line />}
    </>
  )
}
const BloodPressureSection = ({ navigation, bps, showList }: BPSProps) => {
  const intl = useIntl()
  const showBpHistoryButton = bps.length >= showList

  return (
    <View style={[containerStyles.containerSegment]}>
      <BodyHeader
        style={[styles.sectionHeader, !bps.length ? { marginBottom: 8 } : {}]}
      >
        <FormattedMessage id="home.my-bp" />
      </BodyHeader>
      {bps.length > 0 &&
        bps.map((bp, index) => {
          return (
            <BloodPressureEntry
              key={index}
              showSeparator={index < bps.length - 1 && index < showList - 1}
              bp={bp}
              navigation={navigation}
            />
          )
        })}
      <View style={{ marginTop: 16, flexDirection: 'row' }}>
        <Button
          style={[
            styles.bpButton,
            {
              marginRight: showBpHistoryButton ? 6 : 0,
            },
          ]}
          buttonType={ButtonType.LightBlue}
          title={intl.formatMessage({
            id: showBpHistoryButton ? 'home.add' : 'home.add-bp',
          })}
          onPress={() => {
            navigation.navigate(SCREENS.ADD_BP_STACK)
          }}
        />
        {showBpHistoryButton && (
          <Button
            style={[
              styles.bpButton,
              {
                marginLeft: 6,
              },
            ]}
            buttonType={ButtonType.LightBlue}
            title={intl.formatMessage({ id: 'general.see-all' })}
            onPress={() => {
              navigation.navigate(SCREENS.BP_HISTORY, {
                bps,
              })
            }}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 103,
    overflow: 'visible',
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.green2,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  informationIcon: {
    marginRight: 16,
    flexShrink: 0,
  },
  bpButton: {
    flex: 1,
  },
  historyItem: {
    /*
      borderTopWidth: 1,
      borderColor: colors.grey3,*/
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default BloodPressureSection
