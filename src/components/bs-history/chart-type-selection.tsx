import React from 'react'
import {View} from 'react-native'

import {ChartTypeSelectionPill} from './chart-type-selection-pill'
import {ChartData} from './chart-data'
import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
import {useIntl} from 'react-intl'

type ChartSelectionProps = {
  chartData: ChartData
  changeChartTypeHandler: (newChartType: BLOOD_SUGAR_TYPES) => void
}

export const ChartTypeSelection = ({
  chartData,
  changeChartTypeHandler,
}: ChartSelectionProps) => {
  const intl = useIntl()

  return (
    <View style={{flexDirection: 'row', paddingTop: 20}}>
      {(chartData.getHasRandomReadings() ||
        chartData.getHasPostPrandialReadings()) && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartData.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.RANDOM_BLOOD_SUGAR}
          pillLabel={
            intl.formatMessage({
              id: 'bs.random-blood-code',
            }) +
            '/' +
            intl.formatMessage({
              id: 'bs.post-prenial-code',
            })
          }
        />
      )}
      {chartData.getHasFastingReadings() && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartData.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR}
          pillLabel={intl.formatMessage({
            id: 'bs.fasting-code',
          })}
        />
      )}
      {chartData.getHasHemoglobicReadings() && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartData.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.HEMOGLOBIC}
          pillLabel={intl.formatMessage({
            id: 'bs.hemoglobic-code',
          })}
        />
      )}
    </View>
  )
}
