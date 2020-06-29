import React from 'react'
import {View, StyleSheet, TouchableHighlight} from 'react-native'
import {useIntl, FormattedMessage} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'

import {containerStyles, colors} from '../../styles'
import SCREENS from '../../constants/screens'
import {RootStackParamList} from '../../Navigation'
import {
  Button,
  Line,
  BodyHeader,
  BsInformation,
  ButtonType,
} from '../../components'

import {BloodSugar} from '../../redux/blood-sugar/blood-sugar.models'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type BSSProps = {
  navigation: HomeScreenNavigationProp
  bloodSugarReadings: BloodSugar[]
  showList: number
}
const BloodSugarSection = ({
  navigation,
  bloodSugarReadings,
  showList,
}: BSSProps) => {
  const intl = useIntl()
  const showBsHistoryButton = bloodSugarReadings.length >= showList

  return (
    <View style={[containerStyles.containerSegment]}>
      <BodyHeader
        style={[
          styles.sectionHeader,
          !bloodSugarReadings.length ? {marginBottom: 8} : {},
        ]}>
        <FormattedMessage id="home.my-blood-sugar" />
      </BodyHeader>
      {bloodSugarReadings.length > 0 && (
        <>
          {bloodSugarReadings.map((bs, index) => {
            return (
              <View key={index}>
                <TouchableHighlight
                  underlayColor={colors.grey4}
                  onPress={() => {
                    navigation.navigate(SCREENS.DETAILS_MODAL_SCREEN, {
                      bs,
                    })
                  }}
                  style={[
                    {
                      paddingVertical: 12,
                      marginHorizontal: -24,
                      paddingHorizontal: 24,
                    },
                    styles.historyItem,
                    index === bloodSugarReadings.length - 1
                      ? {borderBottomWidth: 0}
                      : {},
                  ]}>
                  <BsInformation bs={bs} />
                </TouchableHighlight>
                {index < bloodSugarReadings.length - 1 &&
                  index < showList - 1 && <Line key={'line' + index} />}
              </View>
            )
          })}
        </>
      )}
      <View style={{marginTop: 16, flexDirection: 'row'}}>
        <Button
          style={[
            styles.bpButton,
            {
              marginRight: showBsHistoryButton ? 6 : 0,
            },
          ]}
          buttonType={ButtonType.LightBlue}
          title={intl.formatMessage({
            id: showBsHistoryButton ? 'home.add' : 'home.add-bs',
          })}
          onPress={() => {
            navigation.navigate(SCREENS.ADD_BS)
          }}
        />
        {showBsHistoryButton && (
          <Button
            style={[
              styles.bpButton,
              {
                marginLeft: 6,
              },
            ]}
            buttonType={ButtonType.LightBlue}
            title={intl.formatMessage({id: 'general.see-all'})}
            onPress={() => {
              navigation.navigate(SCREENS.BS_HISTORY, {
                bloodSugars: bloodSugarReadings,
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

export default BloodSugarSection
