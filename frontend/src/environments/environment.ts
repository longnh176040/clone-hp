// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: "http://localhost:3200/api",
  bucket: "https://s3-ap-southeast-1.amazonaws.com/hp.minastik.com/",
  socketServer: "http://localhost:3200",

  firebaseConfig: {
    apiKey: "AIzaSyCfcw0QH-4YHMDemD9oCZceA1YG0RU9dN4",
    authDomain: "mobiles-113.firebaseapp.com",
    databaseURL: "https://mobiles-113.firebaseio.com",
    projectId: "mobiles-113",
    storageBucket: "mobiles-113.appspot.com",
    messagingSenderId: "979795380907",
    appId: "1:979795380907:web:1a6b1c86f470eb24a705ee",
    measurementId: "G-QHDB87LEBH"
  },

  viewID: "ga:245019971",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
