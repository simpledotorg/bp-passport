# BP Passport

## Version 0.3

### Overview

Build 0.3 is prepped to connect the live api when it's ready. However, at the time of completing build 0.3 the api spec was not finalised and the GET /patient api call not yet available so we've rolled this build out to connect to our own mock api for now.

This does mean that any QR code and any OTP will appear to authenticate against our mock api.

### What's New

- It handles the 2-step authentication including error handling from the api. Please note however that our mock server has been setup to accept any QR code so you'll only be able to
- 2-factor api authentication complete
  Please n

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
