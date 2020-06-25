import React from 'react'
import {View} from 'react-native'

import {ChartTypeSelectionPill} from './chart-type-selection-pill'
import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
import {useIntl} from 'react-intl'
import {IDefineChartsAvailable} from './i-define-charts-available'

type ChartSelectionProps = {
  chartTypesAvailable: IDefineChartsAvailable
  changeChartTypeHandler?: (newChartType: BLOOD_SUGAR_TYPES) => void
}

export const ChartTypeSelection = ({
  chartTypesAvailable,
  changeChartTypeHandler,
}: ChartSelectionProps) => {
  const intl = useIntl()

  return (
    <View style={{flexDirection: 'row', paddingTop: 20}}>
      {(chartTypesAvailable.getHasRandomReadings() ||
        chartTypesAvailable.getHasPostPrandialReadings()) && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartTypesAvailable.getChartType()}
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
      {chartTypesAvailable.getHasFastingReadings() && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartTypesAvailable.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.FASTING_BLOOD_SUGAR}
          pillLabel={intl.formatMessage({
            id: 'bs.fasting-code',
          })}
        />
      )}
      {chartTypesAvailable.getHasHemoglobicReadings() && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartTypesAvailable.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.HEMOGLOBIC}
          pillLabel={intl.formatMessage({
            id: 'bs.hemoglobic-code',
          })}
        />
      )}
    </View>
  )
}
