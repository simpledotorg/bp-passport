const bringYourAppImage = require('../../assets/images/health-reminders/bring-your-app.png')
const checkYourBPImage = require('../../assets/images/health-reminders/check-your-bp.png')
const fruitsImage = require('../../assets/images/health-reminders/fruits.png')
const exerciseMoreImage = require('../../assets/images/health-reminders/exercise-more.png')
const talkToYourDoctorImage = require('../../assets/images/health-reminders/talk-to-your-doctor.png')

export class HealthReminderModel {
  private readonly _image: any
  private readonly _translationId: string

  public static All(): HealthReminderModel[] {
    return [
      HealthReminderModel.BringYourApp(),
      HealthReminderModel.CheckYourBP(),
      HealthReminderModel.Fruits(),
      HealthReminderModel.ExerciseMore(),
      HealthReminderModel.TakToYourDoctor(),
    ]
  }

  public static BringYourApp(): HealthReminderModel {
    return new HealthReminderModel(bringYourAppImage, 'health-reminders.app')
  }

  public static CheckYourBP(): HealthReminderModel {
    return new HealthReminderModel(checkYourBPImage, 'health-reminders.check')
  }

  public static Fruits(): HealthReminderModel {
    return new HealthReminderModel(fruitsImage, 'health-reminders.sugar')
  }

  public static ExerciseMore(): HealthReminderModel {
    return new HealthReminderModel(
      exerciseMoreImage,
      'health-reminders.healthy',
    )
  }

  public static TakToYourDoctor(): HealthReminderModel {
    return new HealthReminderModel(
      talkToYourDoctorImage,
      'health-reminders.doctor',
    )
  }

  private constructor(imageParam: any, translationIdParam: string) {
    this._image = imageParam
    this._translationId = translationIdParam
  }

  public get image(): any {
    return this._image
  }

  public get translationId(): string {
    return this._translationId
  }
}
