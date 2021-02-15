import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext, FirebaseApp } from "./Auth.js";

export default function NavLinks() {
  const { currentUser } = useContext(AuthContext);
  return (
    !!currentUser
      ? <>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/keys">Keys</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => FirebaseApp.auth().signOut()}>
                Sign Out ({currentUser.displayName})
                </Link>
            </li>
          </ul>
        </div>
      </>
      : <>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/signin">Sign In</Link>
            </li>
          </ul>
        </div>
      </>
  );
}