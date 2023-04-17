import React from 'react'
import { View, StyleSheet, ViewProps } from 'react-native'
import { Skeleton } from '@rneui/themed'
import { colors } from '../styles'

export enum ContentLoadingSegmentSize {
  Small,
  Large,
}

interface Props extends ViewProps {
  size: ContentLoadingSegmentSize
}

export const Placeholder = ({ size }: Props) => {
  if (size === ContentLoadingSegmentSize.Small) {
    return (
      <View style={styles.container}>
        <Skeleton
          width={styles.lineWidthNormal.width}
          height={styles.lineHeightThick.height}
          style={{
            borderRadius: styles.lineHeightThick.height / 2,
            marginBottom: 10,
          }}
        />
        <Skeleton
          height={styles.lineHeightThin.height}
          style={{
            borderRadius: styles.lineHeightThin.height / 2,
            marginBottom: 20,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: styles.circleDiameter.width,
          }}
        >
          <Skeleton
            style={{
              height: styles.circleDiameter.width,
              width: styles.circleDiameter.width,
              borderRadius: styles.circleDiameter.width / 2,
            }}
          />
          <Skeleton
            width={styles.lineWidthXWide.width}
            height={styles.lineHeightThin.height}
            style={{
              marginLeft: 28,
              borderRadius: styles.lineHeightThin.height / 2,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: styles.circleDiameter.width,
            marginTop: 12,
          }}
        >
          <Skeleton
            style={{
              height: styles.circleDiameter.width,
              width: styles.circleDiameter.width,
              borderRadius: styles.circleDiameter.width / 2,
            }}
          />
          <Skeleton
            width={styles.lineWidthXWide.width}
            height={styles.lineHeightThin.height}
            style={{
              marginLeft: 28,
              borderRadius: styles.lineHeightThin.height / 2,
            }}
          />
        </View>

        <View style={{ marginTop: 22, alignItems: 'center' }}>
          <Skeleton
            height={styles.lineHeightXThick.height}
            style={{
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    )
  }
  if (size === ContentLoadingSegmentSize.Large) {
    return (
      <View style={styles.container}>
        <Skeleton
          width={styles.lineWidthWider.width}
          height={styles.lineHeightThick.height}
          style={{ borderRadius: styles.lineHeightThick.height / 2 }}
        />

        <View style={{ marginTop: 36 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: styles.circleDiameter.width,
            }}
          >
            <Skeleton
              style={{
                height: styles.circleDiameter.width,
                width: styles.circleDiameter.width,
                borderRadius: styles.circleDiameter.width / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: styles.circleDiameter.width,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <Skeleton
                width={styles.lineWidthNarrow.width}
                height={styles.lineHeightThin.height}
                style={{
                  borderRadius: styles.lineHeightThin.height / 2,
                }}
              />
              <Skeleton
                width={styles.lineWidthWide.width}
                height={styles.lineHeightThin.height}
                style={{
                  borderRadius: styles.lineHeightThin.height / 2,
                }}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 39 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: styles.circleDiameter.width,
            }}
          >
            <Skeleton
              style={{
                height: styles.circleDiameter.width,
                width: styles.circleDiameter.width,
                borderRadius: styles.circleDiameter.width / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: styles.circleDiameter.width,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <Skeleton
                width={styles.lineWidthNarrow.width}
                height={styles.lineHeightThin.height}
                style={{
                  borderRadius: styles.lineHeightThin.height / 2,
                }}
              />
              <Skeleton
                width={styles.lineWidthWide.width}
                height={styles.lineHeightThin.height}
                style={{
                  borderRadius: styles.lineHeightThin.height / 2,
                }}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingTop: 39 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: styles.circleDiameter.width,
            }}
          >
            <Skeleton
              style={{
                height: styles.circleDiameter.width,
                width: styles.circleDiameter.width,
                borderRadius: styles.circleDiameter.width / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: styles.circleDiameter.width,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <Skeleton
                width={styles.lineWidthNarrow.width}
                height={styles.lineHeightThin.height}
                style={{
                  borderRadius: styles.lineHeightThin.height / 2,
                }}
              />
              <Skeleton
                width={styles.lineWidthWide.width}
                height={styles.lineHeightThin.height}
                style={{
                  borderRadius: styles.lineHeightThin.height / 2,
                }}
              />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 36 }}>
          <Skeleton
            height={styles.lineHeightXThick.height}
            style={{
              borderRadius: 2,
            }}
          />
        </View>
      </View>
    )
  }
  return null
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: '5%',
    marginBottom: 8,
    flexShrink: 0,
    gap: 5,
    paddingHorizontal: '7%',
    paddingVertical: '8%',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  lineHeightThin: {
    height: 12,
  },
  lineHeightThick: {
    height: 16,
  },
  lineHeightXThick: {
    height: 48,
  },
  circleDiameter: {
    width: 36,
  },
  lineWidthNormal: {
    width: '45%',
  },
  lineWidthNarrow: {
    width: '48%',
  },
  lineWidthWide: {
    width: '58%',
  },
  lineWidthWider: {
    width: '55%',
  },
  lineWidthXWide: {
    width: '55%',
  },
})
