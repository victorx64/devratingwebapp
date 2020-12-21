import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Repo from './Repo.js';
import Policy from './Policy.js';
import Authors from './Authors.js';
import Ratings from './Ratings.js';
import Works from './Works.js';
import SignIn from './SignIn.js';
import SignInLink from './SignInLink.js';
import { AuthProvider } from "./Auth";

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
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/authors/:id">
              <Authors />
            </Route>
            <Route path="/works/:id">
              <Works />
            </Route>
            <Route path="/ratings/:id">
              <Ratings />
            </Route>
            <Route path="/policy">
              <Policy />
            </Route>
            <Route path="/repo/:repository">
              <Repo />
            </Route>
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
