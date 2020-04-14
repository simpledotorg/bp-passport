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
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {Button, BodyHeader, BodyText} from '../components'

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.HOME
>

type Props = {
  navigation: HomeScreenNavigationProp
}

function Home({navigation}: Props) {
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
  ]

  const isBloodPressureHigh = (bp: any) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bp.systolic >= 140 || bp.diastolic >= 90
  }

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
                My Medicines
              </BodyHeader>
              <BodyText
                style={[
                  {
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
            bps.map((bp, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Image source={redHeart} style={[styles.informationIcon]} />
                <View>
                  <BodyText
                    style={{
                      fontSize: 18,
                      color: colors.grey0,
                      fontWeight: '500',
                    }}>{`${bp.systolic}/${bp.diastolic}`}</BodyText>
                  <BodyText
                    style={{
                      fontSize: 16,

                      color: colors.grey1,
                    }}>
                    {bp.date}
                  </BodyText>
                </View>
                {isBloodPressureHigh(bp) ? (
                  <BodyText
                    style={[
                      styles.bpText,
                      {
                        color: colors.red1,
                      },
                    ]}>
                    High BP
                  </BodyText>
                ) : (
                  <BodyText
                    style={[
                      styles.bpText,
                      {
                        color: colors.green1,
                      },
                    ]}>
                    Normal BP
                  </BodyText>
                )}
              </View>
            ))
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
  bpText: {
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 'auto',
  },
  informationIcon: {
    marginRight: 16,
    flexShrink: 0,
  },
})
