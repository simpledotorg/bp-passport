// const Realm = require('realm')

export interface Patient {
  patient_id: string
  full_name?: string
  password_digest?: string
}

/*

export class Patient {
  public static schema: Realm.ObjectSchema = {
    name: 'Patient',
    primaryKey: 'patient_id',
    properties: {
      patient_id: 'string', // required property
      full_name: 'string?', // optional property
      password_digest: 'string?', // optional property
    },
  }

  public patient_id: string
  public full_name?: string | undefined
  public password_digest?: string | undefined
  /*
  get fullName() {
    return this.firstName + ' ' + this.lastName
  }
  */
}

*/