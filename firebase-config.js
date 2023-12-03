import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCR3NGDLZLzs52SZg6Gl1Dx2peZCWZ5bKE",
    authDomain: "myhome-23efe.firebaseapp.com",
    databaseURL: "https://myhome-23efe-default-rtdb.firebaseio.com",
    projectId: "myhome-23efe",
    storageBucket: "myhome-23efe.appspot.com",
    messagingSenderId: "162027050917",
    appId: "1:162027050917:web:bc9e8af91acbdc6c9bfa4c"
  };


  const app = initializeApp(firebaseConfig);

export   const db = getFirestore()