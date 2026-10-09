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
    extra: {
      ...config.extra,
      // Dev builds only: point every country at a local simple-server, e.g. http://10.0.2.2:3000/api/v4
      localApi: process.env.BP_PASSPORT_LOCAL_API,
    },
  }
}
