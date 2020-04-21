import React, {useState, useContext} from 'react'
import {SafeAreaView, View, StyleSheet, TextInput} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {format} from 'date-fns'
import {FormattedMessage, useIntl} from 'react-intl'

import {containerStyles, colors, navigation} from '../styles'
import {BodyText, Button} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {BloodPressure} from '../models'
import {UserContext} from '../providers/user.provider'

type AddBpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_BP
>

type AddBpScreen = RouteProp<RootStackParamList, SCREENS.ADD_BP>

type Props = {
  navigation: AddBpScreenNavigationProp
  route: AddBpScreen
}

function AddBpScreen({navigation, route}: Props) {
  const intl = useIntl()
  const {bloodPressures, updatePatientBloodPressureData} = useContext(
    UserContext,
  )

  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')

  const isSaveDisabled = () => {
    return systolic === '' || diastolic === ''
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <View style={{padding: 24}}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={[styles.input, {marginRight: 4}]}
              onChangeText={(text) => setSystolic(text)}
              placeholder={intl.formatMessage({id: 'general.systolic'})}
              value={systolic}
              keyboardType={'numeric'}
            />
            <TextInput
              style={[styles.input, {marginLeft: 4}]}
              onChangeText={(text) => setDiastolic(text)}
              placeholder={intl.formatMessage({id: 'general.diastolic'})}
              value={diastolic}
              keyboardType={'numeric'}
            />
          </View>
          <Button
            title={intl.formatMessage({id: 'general.save'})}
            disabled={isSaveDisabled()}
            style={{
              marginTop: 24,
            }}
            onPress={() => {
              const newBloodPressure: BloodPressure = {
                diastolic: Number(diastolic),
                systolic: Number(systolic),
                offline: true,
                recorded_at: new Date().toISOString(),
              }
              const updatedBloodPressures = [
                ...(bloodPressures ?? []),
                newBloodPressure,
              ]

              if (updatePatientBloodPressureData) {
                updatePatientBloodPressureData(updatedBloodPressures)
              }
              navigation.goBack()
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default AddBpScreen

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.white100,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey2,
    padding: 16,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.5,
    color: colors.grey0,
    flex: 1,
  },
})
