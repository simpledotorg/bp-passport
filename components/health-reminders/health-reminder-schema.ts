// resolving ts2307 error by placing require statement directly in array
export const healthReminderImages = [
  require('../../assets/images/health-reminders/bring-your-app.png'),
  require('../../assets/images/health-reminders/check-your-bp.png'),
  require('../../assets/images/health-reminders/fruits.png'),
  require('../../assets/images/health-reminders/exercise-more.png'),
  require('../../assets/images/health-reminders/talk-to-your-doctor.png'),
]

// these ids provide a reference for FormattedMessage to base translations on
export const data = [
  {
    id: 'health-reminders.app',
  },
  {
    id: 'health-reminders.check',
  },
  {
    id: 'health-reminders.sugar',
  },
  {
    id: 'health-reminders.healthy',
  },
  {
    id: 'health-reminders.doctor',
  },
]
