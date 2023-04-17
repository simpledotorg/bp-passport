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
  MedsInformation,
  ButtonType,
} from '../../components'

import { Medication } from '../../redux/medication/medication.models'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>
type MedsProps = {
  navigation: HomeScreenNavigationProp
  meds: Medication[]
}

const MedicalDetailsSection = ({ navigation, meds }: MedsProps) => {
  const intl = useIntl()
  return (
    <View style={[containerStyles.containerSegment]}>
      <BodyHeader
        style={[styles.sectionHeader, !meds.length ? { marginBottom: 8 } : {}]}
      >
        <FormattedMessage id="home.my-medicines" />
      </BodyHeader>
      {meds.length > 0 && (
        <>
          {meds.map((med, index) => {
            return (
              <View key={index}>
                <TouchableHighlight
                  underlayColor={colors.grey4}
                  onPress={() => {
                    navigation.navigate(SCREENS.MEDICATION_DETAILS, {
                      medication: med,
                      isEditing: true,
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
                  <MedsInformation meds={med} />
                </TouchableHighlight>
                {index < meds.length - 1 && <Line key={'line' + index} />}
              </View>
            )
          })}
        </>
      )}
      <View style={{ marginTop: 16, flexDirection: 'row' }}>
        <Button
          style={[
            styles.bpButton,
            {
              marginRight: 0,
            },
          ]}
          buttonType={ButtonType.LightBlue}
          title={intl.formatMessage({ id: 'home.add-medicine' })}
          onPress={() => {
            navigation.navigate(SCREENS.ADD_MEDICINE)
          }}
        />
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

export default MedicalDetailsSection
