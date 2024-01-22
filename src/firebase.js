// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBjDny0ekhTfq35ix2qV7UqndZUfMShmHg',
  authDomain: "mern-estate-54b7f.firebaseapp.com",
  projectId: "mern-estate-54b7f",
  storageBucket: "mern-estate-54b7f.appspot.com",
  messagingSenderId: "158184331825",
  appId: "1:158184331825:web:cb24994f68d0744aa5d310"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);