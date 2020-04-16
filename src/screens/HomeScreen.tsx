import React, {useContext, useState} from 'react'
import {
  Dimensions,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native'
import {useIntl, FormattedMessage} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'

import {
  containerStyles,
  colors,
  greyHeart,
  redHeart,
  medicineClock,
  medicinePill,
} from '../styles'
import {UserContext} from '../providers/user.provider'
import {AuthContext, LoginState} from '../providers/auth.provider'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {Button, BodyHeader, BodyText, BpInformation} from '../components'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type Props = {
  navigation: HomeScreenNavigationProp
}

const BP_SHOW_LIMIT = 3

function Home({navigation}: Props) {
  // Todo - implement Home Loading State when logging in....
  const {loginState} = useContext(AuthContext)
  switch (loginState) {
    case LoginState.LoggingIn:
      // show animation state
      break
    case LoginState.LoggedIn:
      // show user profile
      break
    case LoginState.LoggedOut:
      // n /a
      break
  }

  const {user} = useContext(UserContext)
  const intl = useIntl()

  const [hasMedicines, setHasMedicines] = useState(false)
  const medicines = ['Amlodipine 10 mg', 'Telmisartan 40 mg']

  const bps = [
    {
      systolic: 150,
      diastolic: 88,
      date: '02/02/02',
    },
    {
      systolic: 132,
      diastolic: 88,
      date: '02/02/02',
    },
    {
      systolic: 132,
      diastolic: 92,
      date: '02/02/02',
    },
    {
      systolic: 139,
      diastolic: 76,
      date: '02/02/02',
    },
  ]

  const showBpHistoryButton = bps.length > BP_SHOW_LIMIT

  return (
    <SafeAreaView
      style={[containerStyles.fill, {backgroundColor: colors.white}]}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View style={{position: 'absolute', marginTop: -1}}>
        <View style={{backgroundColor: colors.blue1, height: 30}} />
        <View
          style={[
            containerStyles.fill,
            {
              width: 0,
              height: 0,
              marginTop: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderTopWidth: 50,
              borderRightWidth: Dimensions.get('window').width,
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderTopColor: colors.blue1,
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: colors.blue1,
            },
          ]}
        />
      </View>
      <ScrollView contentContainerStyle={[containerStyles.fill]}>
        {hasMedicines && (
          <>
            <View style={[styles.homeContainer]}>
              <BodyHeader style={[styles.sectionHeader]}>
                <FormattedMessage id="home.my-medicines" />
              </BodyHeader>
              <BodyText
                style={[
                  {
                    marginTop: 8,
                    fontSize: 18,
                    color: colors.grey1,
                  },
                ]}>
                <FormattedMessage id={'home.no-more-medicines'} />
              </BodyText>
              {medicines.map((medicine, index) => (
                <View
                  key={index}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: index === 0 ? 8 : 0,
                    },
                  ]}>
                  <Image
                    source={medicinePill}
                    style={[styles.informationIcon]}
                  />
                  <BodyText
                    style={{
                      fontSize: 18,
                      color: colors.grey0,
                      fontWeight: '500',
                    }}>
                    {medicine}
                  </BodyText>
                </View>
              ))}
            </View>
            <View style={[styles.homeContainer, {flexDirection: 'row'}]}>
              <Image source={medicineClock} style={[styles.informationIcon]} />
              <View style={[{flexShrink: 1}]}>
                <BodyText style={[styles.sectionText]}>
                  <FormattedMessage id={'home.take-your-medicines'} />
                </BodyText>
                <BodyText
                  style={[
                    {
                      fontSize: 18,
                      color: colors.grey1,
                    },
                  ]}>
                  <FormattedMessage id={'home.take-medicine-as-directed'} />
                </BodyText>
              </View>
            </View>
          </>
        )}
        <View style={[styles.homeContainer]}>
          <BodyHeader style={[styles.sectionHeader]}>My BP</BodyHeader>
          {bps ? (
            <>
              {bps.map((bp, index) => {
                if (index > BP_SHOW_LIMIT - 1) {
                  return null
                }

                return <BpInformation bp={bp} key={index} />
              })}
              {showBpHistoryButton && (
                <Button
                  style={{
                    marginTop: 15,
                    backgroundColor: colors.blue3,
                    shadowColor: 'rgba(0, 117, 235, 0.3)',
                  }}
                  buttonColor={colors.blue2}
                  title={intl.formatMessage({id: 'home.see-all'})}
                  onPress={() => {
                    navigation.navigate(SCREENS.BP_HISTORY, {bps})
                  }}
                />
              )}
            </>
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                style={{
                  marginTop: 32,
                  marginBottom: 4,
                }}
                source={greyHeart}
              />
              <BodyText
                style={[
                  styles.sectionText,
                  {
                    color: colors.grey1,
                    marginBottom: 70,
                  },
                ]}>
                <FormattedMessage id={'home.no-bp'} />
              </BodyText>
            </View>
          )}
        </View>
      </ScrollView>
      <Button
        style={{
          backgroundColor: colors.green1,
          marginTop: 'auto',
          margin: 8,
        }}
        title={intl.formatMessage({id: 'home.contact-a-doctor'})}
        onPress={() => {}}
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    flexShrink: 0,
    padding: 24,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  informationIcon: {
    marginRight: 16,
    flexShrink: 0,
  },
})
