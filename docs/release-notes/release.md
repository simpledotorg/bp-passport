# BP Passport

## Version 0.4

### Overview

Points to sandbox api? User accounts test with?

### What's New

- App now reads/writes from offline storage (from api) for Patient details, Blood Pressures and Medications - no internet connection is required for the home screen state to render on a relaunch
- Medicines loaded in from api
- App now points to live sandbox api (rather than mock api)
- All BPs screen ui changes (separator lines, disclosure arrow etc)
- Adding offline BPs
- Viewing BP Detail
- Deleting offline BPs
- Home Screen loading animation

### Issues fixed

- Bug - All My BP - Header is close to start of scroll list
- Terms and conditions link going to the wrong URL
- No blood pressure was showing no grey heart and information regarding no blood readings
- Layout spacing on All BP screen
- All BPs screen now scrolls if required

## Version 0.3

### Overview

Please note that build 0.3 is prepped to connect the live api when it's ready. However, at the time of completing build 0.3 the api spec was not finalised and the GET /patient api call not yet available so we've rolled this build out to connect to our own mock api for now.

This does mean that any QR code and any OTP will appear to authenticate against our mock api. The app will handle errors when connected to a working api.

### What's New

- Mock API created and now in use but current app to unblock front end app dev.
- 2-step authentication including error handling from the api.
- Scan Screen complete (now calls api and displays loading ui and error handling)
- Verify Screen complete (now calls api and displays loading ui and error handling)
- Loading and rendering Patient data from api
- Loading and rendering BP data from api
- Loading and rendering medicine data from api
- Home Screen (apart from loading) complete (now calls api and displays loading ui), supports state for no BP, 3 or less BP, medicine, no medicine etc.
- Home Screen loading state - 50% complete. Animations still to come
- All BP Records screen complete
- Settings Screen complete
- Ability to change language in settings complete
- Successful login now persists user between app sessions

### Issues / fixes

- A few design/layout tweaks from testing
- App now uses native Alert view on iOS and Android where applicable

## Version 0.2

### What's New

- Splash Screen UI
- Consent Screen UI
- Consent Screen links out to privacy & principles
- Login Screen UI
- Login Screen no passport modal message
- QR code camera access handling. Awaiting api for integration
- Scan BP Passport Screen UI
- Verify Pin UI - currently just links to initial home screen ui
- Home Screen - Header and patient data display.

## Version 0.1

### What's New

- Loading screen
- App icon
- Basic navigation
- Multilingual support
