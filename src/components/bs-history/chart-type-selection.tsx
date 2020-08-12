import React from 'react'
import {View, Dimensions} from 'react-native'

import {ChartTypeSelectionPill} from './chart-type-selection-pill'
import {BLOOD_SUGAR_TYPES} from '../../redux/blood-sugar/blood-sugar.models'
import {useIntl} from 'react-intl'
import {IDefineChartsAvailable} from './i-define-charts-available'

type ChartSelectionProps = {
  chartTypesAvailable: IDefineChartsAvailable
  changeChartTypeHandler?: (newChartType: BLOOD_SUGAR_TYPES) => void
}

const hasBeforeEatingTypes = (chartTypesAvailable: IDefineChartsAvailable) => {
  return (
    chartTypesAvailable.getHasFastingReadings() ||
    chartTypesAvailable.getHasBeforeEatingReadings()
  )
}

const hasAfterEatingTypes = (chartTypesAvailable: IDefineChartsAvailable) => {
  return (
    chartTypesAvailable.getHasAfterEatingReadings() ||
    chartTypesAvailable.getHasRandomReadings() ||
    chartTypesAvailable.getHasPostPrandialReadings()
  )
}

export const ChartTypeSelection = ({
  chartTypesAvailable,
  changeChartTypeHandler,
}: ChartSelectionProps) => {
  const intl = useIntl()

  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -20,
        paddingTop: 20,
      }}>
      {hasAfterEatingTypes(chartTypesAvailable) && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartTypesAvailable.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.AFTER_EATING}
          pillLabel={intl.formatMessage({
            id: 'bs.after-eating-title',
          })}
        />
      )}
      {hasBeforeEatingTypes(chartTypesAvailable) && (
        <ChartTypeSelectionPill
          changeChartType={changeChartTypeHandler}
          currentChartType={chartTypesAvailable.getChartType()}
          newChartType={BLOOD_SUGAR_TYPES.BEFORE_EATING}
          pillLabel={intl.formatMessage({
            id: 'bs.before-eating-title',
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
