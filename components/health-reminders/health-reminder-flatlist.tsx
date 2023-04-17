import React, { useState, useRef } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { FormattedMessage } from 'react-intl'

import type { ViewToken } from '../../node_modules/react-native/Libraries/Lists/VirtualizedList'

import { BodyText } from '../text'
import { data, healthReminderImages } from './health-reminder-schema'

const { width } = Dimensions.get('window')

const ITEM_LENGTH = width - 36 // Item is a square. Therefore, its height and width are of the same length.

export const HealthReminderFlatlist = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(0)
  const flatListRef = useRef<FlatList | null>()
  const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 }

  const onViewRef = useRef(({ changed }: { changed: ViewToken[] }): void => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index)
    }
  })

  return (
    <>
      <FlatList
        style={{ marginHorizontal: 0 }}
        data={data}
        renderItem={({ item, index }) => {
          const image = healthReminderImages[index]

          return (
            <View style={styles.healthReminderContainer}>
              <Image source={image} style={styles.image} />
              <BodyText style={styles.message}>
                <FormattedMessage id={item.id} />
              </BodyText>
            </View>
          )
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        pagingEnabled
        ref={(ref) => (flatListRef.current = ref)}
        viewabilityConfig={viewConfigRef}
        onViewableItemsChanged={onViewRef.current}
      />
      <View style={styles.dotView}>
        {data.map((item, index: number) => (
          <TouchableOpacity
            key={index.toString()}
            style={[
              styles.circle,
              {
                backgroundColor: index === currentIndex ? '#0075EB' : '#ADB2B8',
              },
            ]}
          />
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 6,
  },
  dotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  healthReminderContainer: {
    paddingHorizontal: 24,
    width: ITEM_LENGTH,
    marginBottom: 8,
    alignItems: 'center',
  },
  image: {
    margin: 24,
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
  },
})
