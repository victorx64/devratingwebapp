import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext, FirebaseApp } from "./Auth.js";

export default function SignInLink() {
  const { currentUser } = useContext(AuthContext);
  return (!!currentUser ?
    <Link className="nav-link" to="/" onClick={() => FirebaseApp.auth().signOut()}>Sign Out ({currentUser.displayName})</Link> :
    <Link className="nav-link" to="/signin">Sign In</Link>
  );
}