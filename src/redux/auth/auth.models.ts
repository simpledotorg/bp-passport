export enum PassportLinkedState {
  NotLinked,
  Linking,
  Linked,
}

export enum LoginState {
  LoggedOut = 0,
  LoggedIn,
}

export interface AuthParams {
  access_token: string
  id: string /* patient id */
  passport: Passport
}

export interface Passport {
  id: string /* passport id */
  shortcode: string
}
