import React, {useState, useRef} from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {useIntl} from 'react-intl'

import {containerStyles, colors, medicinePill} from '../styles'
import SCREENS from '../constants/screens'
import {MEDICINES} from '../constants/medicines'
import {RootStackParamList} from '../Navigation'

import {useThunkDispatch} from '../redux/store'
import {BodyText} from '../components'

type AddMedicineScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.ADD_MEDICINE
>

type AddMedicineScreen = RouteProp<RootStackParamList, SCREENS.ADD_MEDICINE>

type Props = {
  navigation: AddMedicineScreenNavigationProp
  route: AddMedicineScreen
}

function AddMedicineScreen({navigation, route}: Props) {
  const intl = useIntl()
  const dispatch = useThunkDispatch()

  const [input, setInput] = useState<string>('')
  const inputRef = useRef<null | any>(null)

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
        ]}>
        <TextInput
          style={[styles.input]}
          ref={inputRef}
          autoFocus
          placeholder={intl.formatMessage({
            id: 'medicine.enter-name',
          })}
          value={input}
          onChangeText={(text) => setInput(text)}
          maxLength={6}
        />
      </View>
      <KeyboardAwareScrollView style={{flex: 1, backgroundColor: colors.grey4}}>
        <TouchableWithoutFeedback
          style={{flex: 1}}
          onPress={() => {
            if (inputRef?.current?.blur) {
              inputRef?.current?.blur()
            }
          }}>
          <View>
            <View
              style={{
                paddingHorizontal: 8,
              }}>
              <FlatList
                data={MEDICINES}
                renderItem={({item}) => {
                  if (
                    !item.toLowerCase().includes(input.toLowerCase()) ||
                    input === ''
                  ) {
                    return null
                  }

                  return (
                    <View
                      key={item}
                      style={[
                        styles.card,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 8,
                          backgroundColor: colors.white100,
                          borderRadius: 4,
                        },
                      ]}>
                      <Image
                        source={medicinePill}
                        style={{
                          marginHorizontal: 8,
                          flexShrink: 0,
                          height: 40,
                          width: 40,
                        }}
                      />
                      <BodyText style={[styles.medicineText]}>{item}</BodyText>
                    </View>
                  )
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
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
    shadowOffset: {height: 1, width: 1}, // iOS box shadow
    shadowOpacity: 1, // iOS box shadow
    shadowRadius: 1, // iOS box shadow
    elevation: 2, // Android elevation
  },
})
