import React from 'react'
import {SafeAreaView, View, StyleSheet, Alert} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {FormattedMessage, useIntl} from 'react-intl'

import {containerStyles, colors, navigation} from '../styles'
import {BodyText, Button} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {useThunkDispatch} from '../redux/store'
import {deleteBloodSugar} from '../redux/blood-sugar/blood-sugar.actions'
import {
  displayDate,
  isHighBloodSugar,
  getBloodSugarDetails,
} from '../utils/blood-sugars'

type BsDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.BS_DETAILS
>

type BsDetailsScreen = RouteProp<RootStackParamList, SCREENS.BS_DETAILS>

type Props = {
  navigation: BsDetailsScreenNavigationProp
  route: BsDetailsScreen
}

function BsDetailsScreen({navigation, route}: Props) {
  const intl = useIntl()
  const {bs} = route.params

  const dispatch = useThunkDispatch()

  const getBSText = () => {
    const details = getBloodSugarDetails(bs)
    return isHighBloodSugar(bs) ? (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.red1,
          },
        ]}>
        {`${intl.formatMessage({id: 'bs.high'})} ${intl.formatMessage({
          id: details.languageTypeCode,
        })}`}
      </BodyText>
    ) : (
      <BodyText
        style={[
          styles.bsText,
          {
            color: colors.green1,
          },
        ]}>
        {`${intl.formatMessage({id: 'bs.normal'})} ${intl.formatMessage({
          id: details.languageTypeCode,
        })}`}
      </BodyText>
    )
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white100}]}>
        <View style={{padding: 24}}>
          <BodyText style={styles.bsBold}>
            {`${bs.blood_sugar_value} ${intl.formatMessage({id: 'bs.mgdl'})}`}
            <>
              {`, `}
              {getBSText()}
            </>
          </BodyText>
          <BodyText style={styles.bsTag}>
            <FormattedMessage id={getBloodSugarDetails(bs).languageKey} />
          </BodyText>
          <BodyText style={[styles.bsBold, {marginTop: 16}]}>
            {displayDate(bs)}
          </BodyText>
          <BodyText style={styles.bsTag}>
            <FormattedMessage id="general.date" />
          </BodyText>
          {bs.facility && (
            <>
              <BodyText style={[styles.bsBold, {marginTop: 16}]}>
                {bs.facility.name}
              </BodyText>
              <BodyText style={styles.bsTag}>
                <FormattedMessage id="general.added-at" />
              </BodyText>
            </>
          )}
          {bs.offline && (
            <Button
              style={{
                marginTop: 24,
                backgroundColor: colors.blue3,
                shadowColor: 'rgba(0, 117, 235, 0.3)',
              }}
              buttonColor={colors.blue2}
              title={intl.formatMessage({id: 'bs.delete-bs'})}
              onPress={() => {
                Alert.alert(
                  intl.formatMessage({id: 'bs.delete-bs'}),
                  intl.formatMessage({id: 'bs.delete-bs-confirm'}),
                  [
                    {
                      text: intl.formatMessage({id: 'general.cancel'}),
                    },
                    {
                      text: intl.formatMessage({id: 'general.ok'}),
                      onPress: () => {
                        dispatch(deleteBloodSugar(bs))
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

export default BsDetailsScreen

const styles = StyleSheet.create({
  bsText: {
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 'auto',
    textAlign: 'center',
  },
  bsBold: {
    fontSize: 18,
    color: colors.grey0,
    fontWeight: '500',
  },
  bsTag: {
    color: colors.grey1,
    fontSize: 14,
  },
})
