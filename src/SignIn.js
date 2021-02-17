import React, { useContext } from "react";
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { AuthContext } from "./Auth.js";
import { withRouter, Redirect, Link } from "react-router-dom";

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
        <>
            <h1 className="mt-4">Sign In</h1>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            <h1 className="mt-4">Sample repository</h1>
            <div className="table-responsive">
                <table className="table">
                    <tbody>
                        <tr>
                            <td className="align-middle">
                                <Link to="/repositories/sgUj3bYc7wXTAXjF5DN0ON7lTTT2/bitcoin%2Fbitcoin">
                                    bitcoin/bitcoin
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default withRouter(SignIn);