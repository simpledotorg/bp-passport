import React from 'react'
import {colors} from '../styles'
import {View, StyleSheet, ViewProps} from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder'

export enum ContentLoadingSegmentSize {
  Small,
  Large,
}

interface Props extends ViewProps {
  size: ContentLoadingSegmentSize
}

export const ContentLoadingSegment = ({size}: Props) => {
  const lineHeightThick = 16
  const lineHeightThin = 12
  const circleDiameter = 36

  if (size === ContentLoadingSegmentSize.Small) {
    return (
      <View style={styles.container}>
        <Placeholder Animation={Fade}>
          <PlaceholderLine
            width={50}
            height={lineHeightThick}
            style={{borderRadius: lineHeightThick / 2}}
          />
          <PlaceholderLine
            height={lineHeightThin}
            style={{borderRadius: lineHeightThin / 2}}
          />
        </Placeholder>

        <Placeholder Animation={Fade}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: circleDiameter,
            }}>
            <PlaceholderMedia
              style={{
                height: circleDiameter,
                width: circleDiameter,
                borderRadius: circleDiameter / 2,
              }}
            />
            <PlaceholderLine
              width={50}
              height={lineHeightThin}
              noMargin={true}
              style={{
                marginLeft: 28,
                borderRadius: lineHeightThin / 2,
              }}
            />
          </View>
        </Placeholder>

        <Placeholder Animation={Fade} style={{marginTop: 12}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: circleDiameter,
            }}>
            <PlaceholderMedia
              style={{
                height: circleDiameter,
                width: circleDiameter,
                borderRadius: circleDiameter / 2,
              }}
            />
            <PlaceholderLine
              width={50}
              height={lineHeightThin}
              noMargin={true}
              style={{
                marginLeft: 28,
                borderRadius: lineHeightThin / 2,
              }}
            />
          </View>
        </Placeholder>

        <Placeholder Animation={Fade} style={{marginTop: 22}}>
          <PlaceholderLine
            width={100}
            height={circleDiameter}
            noMargin={true}
            style={{
              borderRadius: 2,
            }}
          />
        </Placeholder>
      </View>
    )
  }
  if (size === ContentLoadingSegmentSize.Large) {
    return (
      <View style={styles.container}>
        <Placeholder Animation={Fade}>
          <PlaceholderLine
            width={50}
            height={lineHeightThick}
            noMargin={true}
            style={{borderRadius: lineHeightThick / 2}}
          />
        </Placeholder>

        <Placeholder Animation={Fade} style={{marginTop: 36}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: circleDiameter,
            }}>
            <PlaceholderMedia
              style={{
                height: circleDiameter,
                width: circleDiameter,
                borderRadius: circleDiameter / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: circleDiameter,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <PlaceholderLine
                width={40}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
              <PlaceholderLine
                width={50}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
            </View>
          </View>
        </Placeholder>

        <Placeholder Animation={Fade} style={{paddingTop: 39}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: circleDiameter,
            }}>
            <PlaceholderMedia
              style={{
                height: circleDiameter,
                width: circleDiameter,
                borderRadius: circleDiameter / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: circleDiameter,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <PlaceholderLine
                width={40}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
              <PlaceholderLine
                width={50}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
            </View>
          </View>
        </Placeholder>

        <Placeholder Animation={Fade} style={{paddingTop: 39}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: circleDiameter,
            }}>
            <PlaceholderMedia
              style={{
                height: circleDiameter,
                width: circleDiameter,
                borderRadius: circleDiameter / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: circleDiameter,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <PlaceholderLine
                width={40}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
              <PlaceholderLine
                width={50}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
            </View>
          </View>
        </Placeholder>

        <Placeholder Animation={Fade} style={{paddingTop: 39}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: circleDiameter,
            }}>
            <PlaceholderMedia
              style={{
                height: circleDiameter,
                width: circleDiameter,
                borderRadius: circleDiameter / 2,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                height: circleDiameter,
                marginLeft: 28,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <PlaceholderLine
                width={40}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
              <PlaceholderLine
                width={50}
                height={lineHeightThin}
                noMargin={true}
                style={{
                  borderRadius: lineHeightThin / 2,
                }}
              />
            </View>
          </View>
        </Placeholder>

        <Placeholder Animation={Fade} style={{marginTop: 36}}>
          <PlaceholderLine
            width={100}
            height={circleDiameter}
            noMargin={true}
            style={{
              borderRadius: 2,
            }}
          />
        </Placeholder>
      </View>
    )
  }
  return null
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white100,
    borderRadius: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    flexShrink: 0,
    paddingHorizontal: 24,
    paddingVertical: 26,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
})
