import React from 'react'
import {View, Image, StyleSheet} from 'react-native'
import {HealthReminderModel} from './health-reminder-model'
import {BodyText} from '../text'
import {FormattedMessage} from 'react-intl'

type Props = {
  data: HealthReminderModel
}

export const HealthReminder = ({data}: Props) => {
  return (
    <View
      style={{marginBottom: 8, alignItems: 'center', paddingHorizontal: 24}}>
      <Image source={data.image} style={styles.image} />
      <BodyText
        style={{
          textAlign: 'center',
        }}>
        <FormattedMessage id={data.translationId} />
      </BodyText>
    </View>
  )
}
const styles = StyleSheet.create({
  image: {marginBottom: 24},
})
