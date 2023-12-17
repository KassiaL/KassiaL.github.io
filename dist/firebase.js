// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAYjhRxOYYvHvqKpd04pmhqP25XSuFhqYQ",
    authDomain: "hoplite-74fd1.firebaseapp.com",
    projectId: "hoplite-74fd1",
    storageBucket: "hoplite-74fd1.appspot.com",
    messagingSenderId: "406394195822",
    appId: "1:406394195822:web:b00a657a490afb8bfd7b7f",
    measurementId: "G-KHFS0Z21Y0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

  export function logEventFirebase(eventName, eventValue){
      if (eventValue != "" && eventValue != null)
         logEvent(analytics, eventName, { value : eventValue });
      else
         logEvent(analytics, eventName);
    }