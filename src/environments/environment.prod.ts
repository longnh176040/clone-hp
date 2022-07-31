export const environment = {
  production: true,
  apiURL: "http://116.118.49.234:5009/api",
  bucket: "https://s3-ap-southeast-1.amazonaws.com/hp.minastik.com/",
  socketServer: "http://116.118.49.234:5009",

  firebaseConfig: {
    apiKey: "AIzaSyCfcw0QH-4YHMDemD9oCZceA1YG0RU9dN4",
    authDomain: "mobiles-113.firebaseapp.com",
    databaseURL: "https://mobiles-113.firebaseio.com",
    projectId: "mobiles-113",
    storageBucket: "mobiles-113.appspot.com",
    messagingSenderId: "979795380907",
    appId: "1:979795380907:web:1a6b1c86f470eb24a705ee",
    measurementId: "G-QHDB87LEBH",
  },

  viewID: "ga:245019971",
};

// --------------- upload EC2 from frontend folder-----------------------------------------
// cd dist/frontend && zip -r browser.zip browser && cd
// scp -i minastik.pem Support-HP/frontend/dist/frontend/browser.zip ubuntu@ec2-13-213-43-40.ap-southeast-1.compute.amazonaws.com:hp.minastik.com/browser.zip

// zip -r server.zip server && zip -r node_modules.zip node_modules && cd
// scp -i minastik.pem Support-HP/frontend/server.zip ubuntu@ec2-13-213-43-40.ap-southeast-1.compute.amazonaws.com:hp.minastik.com/server.zip
// scp -i minastik.pem Support-HP/frontend/node_modules.zip ubuntu@ec2-13-213-43-40.ap-southeast-1.compute.amazonaws.com:hp.minastik.com/node_modules.zip

// --------------- connect EC2 ----------------------------------------
// ssh -i "minastik.pem" ubuntu@ec2-13-213-43-40.ap-southeast-1.compute.amazonaws.com
