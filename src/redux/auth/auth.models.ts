/*enum LoginState {
  LoggedOut = 'LoggedOut',
  LoggingIn = 'LoggingIn',
  LoggedIn = 'LoggedIn',
} */

export enum LoginState {
  LoggedOut,
  LoggingIn,
  LoggedIn,
}

export interface AuthParams {
  access_token: string
  id: string /* patient id */
  passport: {id: string /* passport id */; shortcode: string}
}
