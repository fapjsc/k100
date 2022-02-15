import firebase from 'firebase/app';
import 'firebase/messaging';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// 本地
// const {
//   REACT_APP_API_KEY_LOCAL,
//   REACT_APP_FIREBASE_AUTH_DOMAIN_LOCAL,
//   REACT_APP_FIREBASE_PROJECT_ID_LOCAL,
//   REACT_APP_FIREBASE_STORAGE_BUCKET_LOCAL,
//   REACT_APP_FIREBASE_MESSAGING_SENDER_ID_LOCAL,
//   REACT_APP_FIREBASE_APP_ID_LOCAL,
// } = process.env;

// const firebaseConfig = {
//   apiKey: REACT_APP_API_KEY_LOCAL,
//   authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN_LOCAL,
//   projectId: REACT_APP_FIREBASE_PROJECT_ID_LOCAL,
//   storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET_LOCAL,
//   messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID_LOCAL,
//   appId: REACT_APP_FIREBASE_APP_ID_LOCAL,
// };

//** 香港 */
const {
  REACT_APP_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

let messaging;

try {
  messaging = firebase.messaging();
} catch (error) {
  console.log(error);
}

const { REACT_APP_VAPID_KEY, REACT_APP_VAPID_KEY_LOCAL } = process.env;

let currentToken = '';

export const getToken = async setTokenFound => {
  try {
    currentToken = await messaging.getToken({ vapidKey: REACT_APP_VAPID_KEY });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }

  return currentToken;
};

export const deleteToken = async () => {
  try {
    if (currentToken) {
      console.log('delete token');
      const data = await messaging.deleteToken(currentToken);

      if (data) {
        console.log(data, 'delete');
        currentToken = '';
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const onMessageListener = callback => {
  messaging.onMessage(payload => {
    callback(payload);
  });
};
