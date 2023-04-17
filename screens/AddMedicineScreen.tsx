import React, { useState, useRef } from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useIntl } from 'react-intl'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import { containerStyles, colors, medicinePill } from '../styles'
import SCREENS from '../constants/screens'
import { RootStackParamList } from '../navigation/Navigation'
import { BodyText } from '../components'
import { MedicationsLibrarySelector } from '../redux/medication/medication.selectors'
import {
  createAMedicationWithReminder,
  Medication,
} from '../redux/medication/medication.models'

type AddMedicineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_MEDICINE
>

type AddMedicineScreen = RouteProp<RootStackParamList, SCREENS.ADD_MEDICINE>

type Props = {
  navigation: AddMedicineScreenNavigationProp
  route: AddMedicineScreen
}

function AddMedicineScreen({ navigation }: Props) {
  const intl = useIntl()

  const [input, setInput] = useState<string>('')
  const inputRef = useRef<TextInput>(null)

  const medicines = MedicationsLibrarySelector()
  const inputLower = input.toLowerCase()
  const medicinesFiltered: Medication[] = input.length
    ? medicines.filter((item: Medication) => {
        const words = item.name.toLowerCase().split(' ')
        const matches = words.filter((word) => {
          if (word.indexOf(inputLower) === 0) {
            return true
          }
          return false
        })
        return matches.length > 0 ? true : false
      })
    : []

  return (
    <SafeAreaView style={[containerStyles.fill]}>
      <View
        style={[
          styles.card,
          {
            padding: 12,
            backgroundColor: colors.white100,
            borderBottomWidth: 1,
            borderColor: colors.grey4,
          },
        ]}
      >
        <TextInput
          style={[styles.input]}
          ref={inputRef}
          autoFocus
          placeholderTextColor={colors.grey1}
          placeholder={intl.formatMessage({
            id: 'medicine.enter-name',
          })}
          value={input}
          returnKeyType="done"
          autoCorrect={false}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={() => {
            if (input.trim().length) {
              inputRef?.current?.blur()
              navigation.push(SCREENS.MEDICATION_DETAILS, {
                medication: createAMedicationWithReminder(input.trim()),
                isEditing: false,
              })
            }
          }}
        />
      </View>
      <View style={{ flex: 1, backgroundColor: colors.grey4 }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingBottom: 8,
          }}
        >
          <KeyboardAwareFlatList
            keyboardShouldPersistTaps="always"
            data={medicinesFiltered}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              return (
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 8,
                      backgroundColor: colors.white100,
                      borderRadius: 4,
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      inputRef?.current?.blur()
                      navigation.push(SCREENS.MEDICATION_DETAILS, {
                        medication: createAMedicationWithReminder(item.name),
                        isEditing: false,
                      })
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={medicinePill}
                        style={{
                          marginHorizontal: 8,
                          flexShrink: 0,
                          height: 40,
                          width: 40,
                        }}
                      />
                      <BodyText style={[styles.medicineText]}>
                        {item.name}
                      </BodyText>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddMedicineScreen

const styles = StyleSheet.create({
  input: {
    position: 'relative',
    height: 56,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.grey3,
    padding: 16,
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.5,
    color: colors.grey0,
  },
  medicineText: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: colors.grey1,
  },
  card: {
    shadowColor: 'rgba(0, 0, 0, 0.16)', // iOS box shadow
    shadowOffset: { height: 1, width: 1 }, // iOS box shadow
    shadowOpacity: 1, // iOS box shadow
    shadowRadius: 1, // iOS box shadow
    elevation: 2, // Android elevation
  },
})
