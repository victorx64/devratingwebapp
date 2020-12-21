import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Policy from './Policy.js';
import Authors from './Authors.js';
import Ratings from './Ratings.js';
import Works from './Works.js';
import SignIn from './SignIn.js';
import SignInLink from './SignInLink.js';
import Organizations from './Organizations.js';
import Organization from './Organization.js';
import Keys from './Keys.js';
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute.js";

export default function App() {

  return (
    <AuthProvider>
      <HashRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            <img src="/dev-rating-30.png" width="30" height="30" className="d-inline-block align-top mr-3" alt="Dev Rating" />Dev Rating
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <SignInLink />
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <Switch>
            <Route path="/signin" component={SignIn} />
            <PrivateRoute path="/organizations/:organization/keys/" component={Keys} />
            <Route path="/organizations/:organization" component={Organization} />
            <Route path="/authors/:id" component={Authors} />
            <Route path="/works/:id" component={Works} />
            <Route path="/ratings/:id" component={Ratings} />
            <Route path="/policy" component={Policy} />
            <PrivateRoute exact path="/" component={Organizations} />
          </Switch>
        </div>

        <footer className="footer">
          <div className="container">
            <div className="row justify-content-center">
              <span className="text-muted col-auto">email: <a href="mailto:viktor_semenov@outlook.com">viktor_semenov@outlook.com</a></span>
              <Link className="col-auto" to="/policy">Policy</Link >
            </div>
          </div>
        </footer>
      </HashRouter>
    </AuthProvider>
  );
}
