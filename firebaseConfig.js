import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyDNM6k18rhGik2s1JYjHTRv-Bg15cNU1uM",
  authDomain: "eventorganizerapp-7ec51.firebaseapp.com",
  projectId: "eventorganizerapp-7ec51",
  storageBucket: "eventorganizerapp-7ec51.appspot.com",
  messagingSenderId: "142020951937",
  appId: "1:142020951937:web:2b8d40bb95f99019d9b280",
  measurementId: "G-Z5ESRBLTDG",
};


const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


const db = getFirestore(app);


export { auth, db, signInWithEmailAndPassword, collection, query, getDocs, deleteDoc, doc, signOut };
export default app;
