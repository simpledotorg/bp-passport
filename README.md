# BP Passport

BP Passport is a native mobile application written in React Native and powered by [Expo Managed Workflow](https://docs.expo.dev/introduction/managed-vs-bare/).

The source code for the project has been written in basic Typescript. This enables the linter to highlight any issues with undefined model properties or non-interfaced methods. Any new files should either be .ts or .tsx files - Typescript's equivalent to Javascript's js and jsx files (files with UI rendering code).

## Getting Started

### Project Setup

1. Clone this repository

2. CD to the BP Passport project root, then install package dependencies as follows:

#### Expo Environment

Do not install Expo globally. Remove expo from global npm if you've already installed it globally. Instead any expo commands will be run via `npx`.

#### Installing the Dependencies

Each time you switch branches you may need to run the following:

`npx expo install`

The BP Passport codebase contains a number of modules with native iOS and Android code. However, those modules are all installed as Expo plugins. You will never need to run either Xcode or Android Studio when working in this project.

### VSCode Environment

1. Install [VSCode](https://code.visualstudio.com/).

2. CD to `[projectroot]` folder and open the project in VSCode:

3. With the BP Project open, select the `Extensions` from the left side activity bar. VSCode should display any exensions that were enabled for this project. Please search and then add/update the following VSCode extensions:

- ESLint
- Prettier - Code formatter
- React Native Tools
- Prettier-ESLint

### Building with EAS

Building new development build, all platforms

`profile=development npm run build-dev`

Building new development-simulator build, all platforms

`npm run build-dev`

Building new production build

`profile=production npm run build`

Building new preview (internal ASquared) build

`profile=preview npm run build`

Building a new TestFlight and Google Play Beta build (staging api)

`profile=production npm run submit`

### Developing and Running the Project in development

1. Install the latest build with the profile `development-simulator` on either your Android phone or iPhone device from here:

https://expo.dev/accounts/asquared/projects/bp-passport/builds

Alternatively, you can select which simulator build to install and run on your device simulator by running the command:

`eas build:run -p <platform>`

<platform> choose either ios or android

Builds will be listed chronologically with the newest listed first. Compare the CLI build ID with the build 'extra details' by clicking on a build from this list.

https://expo.dev/accounts/asquared/projects/bp-passport/builds

2. Run

`npm start`

3. Scan the QR code with your phone and it should open up the app you just downloaded and shortly afterwards load in the latest javascript. You don't need to be wired to your mac for this to work.

### Reloading the development app

1. Press 'r' when in the node terminal that is running the local development server.

...or

2. Shake your phone

3. Choose the 'Reload' option
