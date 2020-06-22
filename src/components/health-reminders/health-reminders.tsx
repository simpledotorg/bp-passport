import React, {Component} from 'react'
import {Dimensions, Text} from 'react-native'
import {HealthReminder} from './health-reminder'
import {HealthReminderModel} from './health-reminder-model'
import Carousel from 'react-native-snap-carousel'

const DATA: number[] = []
for (let i = 0; i < 10; i++) {
  DATA.push(i)
}

export class HealthReminders extends Component {
  healthReminders = HealthReminderModel.All()
  SLIDER_WIDTH = Dimensions.get('window').width * 0.7
  ITEM_WIDTH = Math.round(this.SLIDER_WIDTH * 0.7)
  ITEM_HEIGHT = Math.round((this.ITEM_WIDTH * 3) / 4)

  _renderItem = ({item, index}) => {
    console.log({item, index})
    return <Text>{item}</Text>
  }

  render() {
    console.log('render')
    return (
      <Carousel
        data={DATA}
        renderItem={this._renderItem}
        sliderWidth={this.SLIDER_WIDTH}
        itemWidth={this.ITEM_WIDTH}
      />
    )
  }
}
