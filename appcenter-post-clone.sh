#!/usr/bin/env bash

echo "Executing post clone script"
echo $GOOGLE_SERVICES_JSON | base64 --decode > ./android/app/google-services.json
echo $GOOGLE_SERVICES_PLIST | base64 --decode > ./ios/BPPassport/GoogleService-Info.plist
echo $APPCENTER_CONFIG_JSON | base64 --decode > ./android/app/src/main/assets/appcenter-config.json
echo $APPCENTER_CONFIG_PLIST | base64 --decode > ./ios/BPPassport/AppCenter-Config.plist

case $APPCENTER_BRANCH in
    "staging")
        cp -f ./.env.production.default ./.env.production
        ;;
    "test")
        cp -f ./.env.production.default ./.env.production
        ;;
    *)
        cp -f ./.env.production.default ./.env.production
        ;;
esac
