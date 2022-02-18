// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: "the-daily-blog-app.firebaseapp.com",
    projectId: "the-daily-blog-app",
    storageBucket: "the-daily-blog-app.appspot.com",
    messagingSenderId: "841951171560",
    appId: "1:841951171560:web:2d5dcedf8384d6f7298a5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;