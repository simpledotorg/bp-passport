import { useIntl } from 'react-intl'
import { Reminder } from '../redux/medication/medication.models'
import { schedulePushNotification } from '../notification'
import { useDispatch } from 'react-redux'
import { medicationScheduleSlice } from '../redux/slices/medicationScheduleSlice'

const getDateText = (day: number) => {
  switch (day) {
    case 1:
      return 'Sunday'
    case 2:
      return 'Monday'
    case 3:
      return 'Tuesday'
    case 4:
      return 'Wednesday'
    case 5:
      return 'Thursday'
    case 6:
      return 'Friday'
    case 7:
      return 'Saturday'
  }
}

const { setMedicationSchedule } = medicationScheduleSlice.actions

export default function useSetNotificationsSchedule() {
  const intl = useIntl()
  const dispatchRedux = useDispatch()

  const setNotificationsSchedule = (
    reminderContent: Reminder,
    medicationContent: string,
    createdAt?: string | undefined,
  ) => {
    if (reminderContent) {
      const days = reminderContent?.days.split('')
      const hour = Math.floor(reminderContent?.dayOffset / 3600)
      const minute = Math.floor((reminderContent?.dayOffset % 3600) / 60)
      const setExpoDate: number[] = []

      days.forEach((day: string) => {
        setExpoDate.push(parseInt(day) + 1)
      })

      setExpoDate.map((date: number) => {
        const body = intl.formatMessage(
          { id: 'medicine.reminder-notification' },
          {
            day: getDateText(date),
            time: `${hour}:${minute < 10 ? '0' + minute : minute}`,
          },
        )

        schedulePushNotification(date, hour, minute, medicationContent, body)
          .then((res) =>
            dispatchRedux(
              setMedicationSchedule({
                medication: createdAt
                  ? `${medicationContent}${createdAt}`
                  : `${medicationContent}`,
                schedule: res,
              }),
            ),
          )
          .catch((e: Error) => console.log(e))
      })
    }
  }

  return setNotificationsSchedule
}
