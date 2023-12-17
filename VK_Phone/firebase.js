// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjsYdrrqslgjbMJYOvzeSr4QCkSn3Hr-s",
  authDomain: "chinese-holiday.firebaseapp.com",
  databaseURL: "https://chinese-holiday-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chinese-holiday",
  storageBucket: "chinese-holiday.appspot.com",
  messagingSenderId: "839550094549",
  appId: "1:839550094549:web:8d91d764345ea8151ae65c",
  measurementId: "G-0MYQ30S8RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

  export function logEventFirebase(eventName, eventValue){
      if (eventValue != "" && eventValue != null)
{
logEvent(analytics, eventName, { value : eventValue });
console.log(eventName + " sended, value: " + eventValue);
}
      else
{
logEvent(analytics, eventName);
console.log(eventName + " sended");
}
    }