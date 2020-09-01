# BP Passport

## Version 1.08

- Adaptive Android Icon

## Version 1.07

### Claudio's List:

- HbA1C - Showing line
- BS Graph - Wrong default graph
- BS/BP Graph - Y axis labels
- BS/BP Graph - Point select style
- BS/BP Graph - Y axis line style + threshold colors
- Translation updates added
- BS Graph - Pill styling
- BP details sheet - Crashing on tap
- BS Graph - Missing y-axis labels
- BP Graph - Missing y-axis label
- Patients - Add BP - Top padding
- Patients - Add BS - Upper limit
- Patients - BP/BS rows - Spacing between lines is inconsistent
- Patients - BS Trend - Tooltip fixes
- Patients - Review modal - Update width
- Patients - Home screen - Wrong spanish string
- Patients - Language options - Show Bengali (BN) and Bengali (IN) options
- Patients - Sheet disclaimer copy - Use new strings and variables

### AS Testing Bugs:

- iOS 10.3.1 Small screen devices require scrolling the Save button
- Scan QR codes - unable to re-scan when pressing 'back' on validation code screen
- Blood Sugar Graphs - no y axis labels when in mmol/L

## Version 1.06

### Hot Fixes

- Fixed text input getting cut off on android
- Fixed font size for health reminders
- Increased spacing of the BP infos

## Version 1.05 (Iteration 12)

### Features and Fixes

- Patient - Better Add BS Experience
- Patient - Health Reminder Cards - Update UI
- Can't scan QR code
- Language updates (New languages)
- Connect to BP Passport - Firebase Analytics Event
- Patient - BP/BS Details Sheet - Update UI
- Patient - Blood Pressure Graph - 4 Months Of Data
- Patient - Blood Sugar Graphs - Update UI
- Patient - Blood Sugar alert / General modals - Update UI
- Patient - Blood Sugar Rows - Update UI
- Patient - Add BP/BS - Figma Styling Issue
- Patient - Settings Screen - Grouping change
- Patient - Language Support
- Patient - Blood sugar row - Space between value and unit
- Patient - BS details sheet - Label lowercase
- Patient - Medicine Details
- Patient - Add BS - Upper value limit

## Version 1.04

### What's New

- Increase android notification size
- Tooltip formatted improved for blood pressure/blood sugar graphs
- Tooltips now displaying in Android for blood pressure/blood sugar graphs
- All data points displaying for blood sugar graph
- Alerts showing for very high/low blood pressure/blood sugar

## Version 1.00

### Many changes and tweaks as per Claudio's priority list:

https://trello.com/b/39A9Sj8R/simple-for-patients

## Version 0.66

### What's New

- Blood sugars history chart

### More bugs quashed & change requests as per the complete column here:

https://trello.com/b/39A9Sj8R/simple-for-patients

## Version 0.65

### Overview

User Testing Release

### What's New

- Non BP Passport Holder - Settings - Connect BP Passport - complete
- BP Chart history
- Latest Translations

### What's In Progress

- Blood sugars history chart

### Many bugs quashed & change requests as per the complete column here:

https://trello.com/b/39A9Sj8R/simple-for-patients

## Version 0.6

### Overview

Medication Reminders. Choose from a list or add your own!

### What's New

- Saving a medication with reminders
- Medication Reminder Push notifications
- Patient - Medicine Detail View - Delete Medicine
- Add custom medications (Gummy bears?!)
- App Prepped for French and Spanish translations
- Offline user Settings state (no profile name and state)
- App no longer signs authenticated BP Passport user out when the auth token expires

### What's In Progress

- BP history chart
- Blood sugars history chart

### Issues fixed

- Lots of other fixes and improvements

## Version 0.5

### Overview

Offline User Mode. Anyone can now use the BP Passport app.

### What's New

- New Offline user flow
- New Home Screen empty states and offline user state
- Patient Splash Screen design changes
- Patient Login Screen design changes
- Patient Launch Screen - background color change
- New app icon
- Consent Screen - content changes
- BP details as an animated modal
- Blood sugar details as an animated modal
- Open a BP or Blood Sugar from the home screen
- Add Medicine filter & choose medication
- Medication Details screen - basic UI and styling
- Set reminder days - UI only
- BP helpful min/max errors info
- Blood sugars helpful min/max errors info

### What's In Progress

- Saving a medication with reminders
- Medication Reminder Push notifications

### Issues fixed

- Issues with text field selection when adding BPs on Android
- Text and Button styling improvements
- Lots of other fixes and improvements

## Version 0.4

### Overview

Big update! BP Passport now integreates with the live sandbox API. You'll need a valid BP test passport to login. All example user passports require OTP code 000000:

https://trello.com/c/Sd5UVesd/88-patient-1
https://trello.com/c/cZ9Bt3XB/89-patient-2
https://trello.com/c/Cuz3oSC8/90-patient-3
https://trello.com/c/3VRp1ajC/91-patient-4
https://trello.com/c/rDr6NZbh/92-patient-5
https://trello.com/c/gzW937RC/93-patient-6

There's a known issue with the API whereby logging into a second device invalidates the API token on the first device. So, until this is resolved the app will elegantly auto-logout the user of the second device when it next attempts to pull/refresh the latest patient's data.

### What's New

- App now reads/writes from offline storage (from api) for Patient details, Blood Pressures and Medications - no internet connection is required for the home screen state to render on a relaunch
- Medicines loaded in from api
- App now points to live sandbox api (rather than mock api)
- All BPs screen ui changes (separator lines, disclosure arrow etc)
- Adding offline BPs
- Viewing BP Detail
- Deleting offline BPs
- Home Screen loading animation
- Setting Screen now displays patient's state/address from api
- Blood Sugars loaded in from API and displayed on home screen
- All Blood Sugar readings screen
- Bloog Sugar detail screen
- Add offline Blood Sugars
- Delete offline Blood Sugars
- GET /patient 401 response results in app autologout (we can change this as required)

### Known API Issues

- Logging into a second device invalidates the API token on the first device. So, until this is resolved the app will elegantly auto-logout the user of the second device when it next attempts to pull/refresh the latest patient's data.

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
