/* eslint-disable linebreak-style */
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDh2vaqP8UU6vjRDUVHvOq55Z3S_AGDpl8',
  authDomain: 'dbtest-a7f8c.firebaseapp.com',
  projectId: 'dbtest-a7f8c',
  storageBucket: 'dbtest-a7f8c.appspot.com',
  messagingSenderId: '553115824549',
  appId: '1:553115824549:web:18768ee95f1360d22bb84c',
  measurementId: 'G-6SB017R648',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage = firebaseApp.storage();
const auth = firebaseApp.auth();

export default {
  firebaseApp, db, storage, auth,
};
