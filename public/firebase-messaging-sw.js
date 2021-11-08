// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
// 本地
// Initialize the Firebase app in the service worker by passing the generated config
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

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-undef
// const messaging = firebase.messaging();

let messaging;

try {
  // Retrieve firebase messaging
  // eslint-disable-next-line no-undef
  messaging = firebase.messaging();
} catch (error) {
  console.log(error);
}

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './favicon-16x16.png',
    click_action: 'https://www.k100u.com/',
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
