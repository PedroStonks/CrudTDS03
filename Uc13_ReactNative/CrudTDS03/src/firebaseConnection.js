import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore';

import{initializeAuth, getReactNativePersistence} from 'firebase/auth';

import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBSbRJAaiK4yFc0gCoQ5VFvkStoWGQGa8I",
  authDomain: "tds03-bb53b.firebaseapp.com",
  projectId: "tds03-bb53b",
  storageBucket: "tds03-bb53b.firebasestorage.app",
  messagingSenderId: "447237225936",
  appId: "1:447237225936:web:35719a2b23558985b14dd5"
};


const app = initializeApp(firebaseConfig);


const auth = initializeAuth (app,{
  persistence:getReactNativePersistence(AsyncStorage)

})


const db = getFirestore(app);

export {db,auth};