import React, { useEffect, useState } from "react";
import firebase from 'firebase/app';
import 'firebase/auth';

export const FirebaseApp = firebase.initializeApp(
  {
    apiKey: 'AIzaSyBhPGvuR2aTmJJ2atYWRpc3cfC7MVin-_Q',
    authDomain: 'sdgsrth5e.firebaseapp.com',
    projectId: 'sdgsrth5e',
    storageBucket: 'sdgsrth5e.appspot.com',
    messagingSenderId: '532534546256',
    appId: '1:532534546256:web:62c24ea68959e5be00e655'
  }
);

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    FirebaseApp.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  }, []);

  if (pending) {
    return <>Loading...</>
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
