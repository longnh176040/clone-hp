// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: "http://localhost:3200/api",
  bucket: "https://s3-ap-southeast-1.amazonaws.com/hp.minastik.com/",
  socketServer: "http://localhost:3200",

  firebaseConfig: {
    apiKey: "AIzaSyARr7HqnHfapA4QmEhA_ICfpj_d3SXeI04",
    authDomain: "support-hp-0103.firebaseapp.com",
    databaseURL: "https://support-hp-0103.firebaseio.com",
    projectId: "support-hp-0103",
    storageBucket: "support-hp-0103.appspot.com",
    messagingSenderId: "897773920815",
    appId: "1:897773920815:web:54b6c0513769a68a75dcda",
    measurementId: "G-LZ27M5MC4E",
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
