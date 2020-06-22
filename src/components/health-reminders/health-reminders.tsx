import React from 'react'
import {HealthReminder} from './health-reminder'
import {HealthReminderModel} from './health-reminder-model'

export const HealthReminders = () => {
  return <HealthReminder data={HealthReminderModel.TakToYourDoctor()} />
}
