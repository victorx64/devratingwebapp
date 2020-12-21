import React, { useContext }  from "react";
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AuthContext } from "./Auth.js";
import { withRouter, Redirect } from "react-router-dom";

const SignIn = () => {

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />;
    }

    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: () => false,
        },
        signInSuccessUrl: '/',
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        privacyPolicyUrl: '/policy'
    };

    return (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    );
}

export default withRouter(SignIn);