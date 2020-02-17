import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDc8wfFinp8dGX-YMfFnDgXxtjXVXSUz1M",
    authDomain: "instaclone-c4517.firebaseapp.com",
    databaseURL: "https://instaclone-c4517.firebaseio.com",
    storageBucket: "gs://instaclone-c4517.appspot.com"
};

firebase.initializeApp(firebaseConfig);

export default firebase