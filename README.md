# BP Passport - Simple for Patients

BP Passport is a native mobile application written in React Native - a JavaScript library that renders native, cross-platform iOS and Android code.

The source code for the project has been written in basic Typescript. This enables the linter to highlight any issues with undefined model properties or non-interfaced methods. Any new files sould either be .ts or .tsx files - Typescript's equivilent to Javasctipt's js and jsx files (files with UI rendering code).

## Getting Started

### Android & iOS Environments

1. Follow the [React Native getting started guide here](https://facebook.github.io/react-native/docs/getting-started). Select the **React Native CLI Quickstart** tab, there's no Expo required in this project.

- Install dependencies listed - Node, Watchman, JDK.
- Install React Native CLI globally.

3. Install [Android Studio](https://developer.android.com/studio)

4. Install/update the [latest version of Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12).

5. Install [CocoaPods](https://cocoapods.org) (iOS package management tool):

```
sudo gem install cocoapods
```

### Project Setup

1. Clone this repository

2. CD to the BP Passport project root then install package dependencies:

```
yarn
```

3. CD to `[projectroot]/ios` folder and install the project iOS pod dependencies:

```
pod install
```

4. CD to `[projectroot]/android/app` folder and make a copy of the `keystore-placeholder.properties` file:

```
cp keystore-placeholder.properties keystore.properties
```

NB - you can update the values in the new `keystore-placeholder.properties` file if you wish to sign android release builds locally. This file is required in order for the android app to build.

### VSCode Environment

1. Install [VSCode](https://code.visualstudio.com/).

2. CD to `[projectroot]` folder and open the project in VSCode:

```
code .
```

3. With the BP Project open select the `Extensions` from the left side activity bar. VSCode should display any exensions that enabled for this project. Please search and then add/update the following VSCode extensions:

- ESLint
- Prettier - Code formatter
- React Native Tools
- TSLint

4. With the 4 extensions above all enabled for this project next using VSCode project explorer panel open the `.vscode` folder at the root. From inside that folder create a new file named `settings.json` and paste the following into your new `settings.json` file:

```
{
    "editor.formatOnSave": true,
    "javascript.format.enable": false,
    "editor.codeActionsOnSave": {
        "source.fixAll.tslint": true
    }
  }
```

## Running the App

During development it will probably be preferable to run the app directly from VSCode. But VSCode relies on react native cli to build and run both the Android and Xcode projects via commandline. This is not always a reliable option, especially when switching between source code branches with modified package dependencies.

So to begin with ensure that both iOS and Android apps can be compiled and run from Android Studio and Xcode.

### Running the Android App from Android Studio

1. Open Android Studio

2. Open the Android source project from `[projectroot]/android`

3. Android's uses gradle to manage package dependenices and gradle should start configuring the android project as soon as you open it in Android Studio. This may take a little while the first time.

4. To run the app in debug mode in an Android emulator you will need at least 1 virtual device. Use Android Studio's Virtual Device Manager to add a new emulator such as a Pixel 2 or 3.

5. Press the 'Run app' green play button to build and run the app on your chosen Android emulator.

### Running the iOS App from Xcode

1. CD `[projectroot]/ios` and open `BPPassport.xcworkspace` in Xcode.

2. Select whichever iOS simulator you'd like to reun the app in and then select the large build and run play button top left to compile and then run the app in the chosen iOS simulator.

## Running/Debugging the App from VSCode

Running and debugging directly from VSCode can be a preferable development flow as you have direct access to the console log in your IDE. To set this up:

1. CD to `[projectroot]` folder and open the project in VSCode:

```
code .
```

2. With the BP Project open select the `Run & Debug` icons from the main left side activity bar.

3. Select the `create a launch.json file`

4. Using the `Add Configuration` option add both of the following run and debug options:

- React Native: Debug iOS
- React Native: Debug Android

5. Save the updated `launch.json` file.

6. A dropdown should now appear top left that will enable you to run and debug the app in either iOS Simulator or Android Emulator.

Please note that before attempting to debug/run the React Native project from VSCode you will need to ensure that React Native's metro bundler is not already running in any background terminal window. It if is close the window!

## Switching git branches

**Everytime you switch branches run the following steps**:

1. Close any terminal window running metro bundler

2. Close VSCode

3. CD to the BP Passport project root then update package dependencies:

```
yarn
```

4. CD to `[projectroot]/ios` folder and update the project iOS pods dependencies:

```
pod install
```
