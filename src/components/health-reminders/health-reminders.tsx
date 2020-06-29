import React, {Component} from 'react'
import {Dimensions, View} from 'react-native'
import {HealthReminder} from './health-reminder'
import {HealthReminderModel} from './health-reminder-model'
import Carousel, {Pagination} from 'react-native-snap-carousel'

interface IProps {}

interface IState {
  entries: HealthReminderModel[]
  activeSlide: number
}

export class HealthReminders extends Component<IState> {
  SLIDER_WIDTH = Dimensions.get('window').width * 0.75
  ITEM_WIDTH = Math.round(this.SLIDER_WIDTH)
  ITEM_HEIGHT = Math.round((this.ITEM_WIDTH * 3) / 4)

  constructor(props: any) {
    super(props)
    this.state = {entries: HealthReminderModel.All(), activeSlide: 0}
  }

  _renderItem = ({item, index}) => {
    return <HealthReminder data={item} />
  }

  get pagination() {
    const {entries, activeSlide} = this.state as IState
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          marginHorizontal: 0,
          marginVertical: 0,
          backgroundColor: '#0075EB',
        }}
        inactiveDotStyle={{
          backgroundColor: '#ADB2B8',
        }}
        inactiveDotScale={1}
        inactiveDotOpacity={1}
      />
    )
  }

  render() {
    return (
      <View style={{alignContent: 'center', alignItems: 'center'}}>
        <Carousel
          data={(this.state as IState).entries}
          renderItem={this._renderItem}
          sliderWidth={this.SLIDER_WIDTH}
          itemWidth={this.ITEM_WIDTH}
          onSnapToItem={(index) => this.setState({activeSlide: index})}
        />
        {this.pagination}
      </View>
    )
  }
}
