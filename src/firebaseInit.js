import firebase from 'firebase/app';
import 'firebase/messaging';

// 本地
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDNrZhATvtisIkhhN8X5tfxEf0umrq98gE',
  authDomain: 'web-push-2f66d.firebaseapp.com',
  projectId: 'web-push-2f66d',
  storageBucket: 'web-push-2f66d.appspot.com',
  messagingSenderId: '802105019569',
  appId: '1:802105019569:web:ec9037b7f31a8b2143e690',
};

//** 香港 */
// const firebaseConfig = {
//   apiKey: 'AIzaSyD1rj-pHvVoh_iRpMinxJOmTVzWqz9Xd1k',
//   authDomain: 'project-7097378441609873165.firebaseapp.com',
//   projectId: 'project-7097378441609873165',
//   storageBucket: 'project-7097378441609873165.appspot.com',
//   messagingSenderId: '987626746733',
//   appId: '1:987626746733:web:bfdba90a8c6514a62ce064',
// };

firebase.initializeApp(firebaseConfig);

let messaging;

try {
  messaging = firebase.messaging();
} catch (error) {
  console.log(error);
}

// const { REACT_APP_VAPID_KEY } = process.env;

// 本地
const FCMKEY =
  'BMnL09T9ZnPU6QYORfcsfxiOWsBcdhrFBa4mEFuW4sG32GT2mqIfdW70lvEMYWML6Gr0NGPRo-49z7mRkJhdDN4';

//** 香港 */
// const FCMKEY =
//   'BKvsu7omq-VMU1ICqm66yPVNmu9i9ROua0tOaw1PI-QoMB70eqKus2LwOBvbMfmBDZdg8ONV3v9np9f0-6bcqsE';

let currentToken = '';

export const getToken = async setTokenFound => {
  try {
    currentToken = await messaging.getToken({ vapidKey: FCMKEY });
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
