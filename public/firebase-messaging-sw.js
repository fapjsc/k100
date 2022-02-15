// Scripts for firebase and firebase messaging

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

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
// const {
//   REACT_APP_API_KEY,
//   REACT_APP_FIREBASE_AUTH_DOMAIN,
//   REACT_APP_FIREBASE_PROJECT_ID,
//   REACT_APP_FIREBASE_STORAGE_BUCKET,
//   REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   REACT_APP_FIREBASE_APP_ID,
// } = process.env;

const firebaseConfig = {
  apiKey: 'AIzaSyD1rj-pHvVoh_iRpMinxJOmTVzWqz9Xd1k',
  authDomain: 'project-7097378441609873165.firebaseapp.com',
  projectId: 'project-7097378441609873165',
  storageBucket: 'project-7097378441609873165.appspot.com',
  messagingSenderId: '987626746733',
  appId: '1:987626746733:web:bfdba90a8c6514a62ce064',
};

//eslint-disable-next-line
self.addEventListener('notificationclick', function (event) {
  // Close notification.
  event.notification.close();

  // Example: Open window after 3 seconds.
  // (doing so is a terrible user experience by the way, because
  //  the user is left wondering what happens for 3 seconds.)
  var promise = new Promise(function (resolve) {
    setTimeout(resolve, 500);
  }).then(function () {
    // return the promise returned by openWindow, just in case.
    // Opening any origin only works in Chrome 43+.
    //eslint-disable-next-line
    return clients.openWindow('https://www.k100u.com');
  });

  // Now wait for the promise to keep the permission alive.
  event.waitUntil(promise);
});

// self.onnotificationclick = function (event) {
//   console.log('On notification click: ', event.notification.tag);
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   //eslint-disable-next-line
//   event.waitUntil(
//     //eslint-disable-next-line
//     clients
//       .matchAll({
//         type: 'window',
//       })
//       .then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url === 'https://www.k100u.com' && 'focus' in client) return client.focus();
//         }
//         //eslint-disable-next-line
//         if (clients.openWindow)
//           //eslint-disable-next-line
//           return clients.openWindow('https://www.k100u.com');
//       })
//   );
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
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
