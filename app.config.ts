import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...(config as ExpoConfig),
    ios: {
      ...config.ios,
      googleServicesFile: process.env.iOS_Google_Services,
    },
    android: {
      ...config.android,
      googleServicesFile: process.env.Android_Google_Services,
    },
  }
}
