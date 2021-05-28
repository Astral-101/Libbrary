import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyCpOOSEL_xkV2rzCVGLzKkK2Q0TQUOCqgs",
    authDomain: "librarian-app-c5eca.firebaseapp.com",
    projectId: "librarian-app-c5eca",
    storageBucket: "librarian-app-c5eca.appspot.com",
    messagingSenderId: "692115346266",
    appId: "1:692115346266:web:f63e1a84feb4916e6b1963"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();