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
import Repositories from './Repositories.js';
import Repository from './Repository.js';
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
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <SignInLink />
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <Switch>
            <Route path="/signin" component={SignIn} />
            <PrivateRoute path="/keys" component={Keys} />
            <Route path="/repositories/:organization/:repo" component={Repository} />
            <Route path="/authors/:id" component={Authors} />
            <Route path="/works/:id" component={Works} />
            <Route path="/ratings/:id" component={Ratings} />
            <Route path="/policy" component={Policy} />
            <PrivateRoute exact path="/" component={Repositories} />
          </Switch>
        </div>

        <footer className="footer">
          <div className="container">
            <div className="row justify-content-center">
              <Link className="col-auto" to="/policy">Policy</Link >
              <a href='https://github.com/victorx64/devrating'>GitHub</a>
            </div>
          </div>
        </footer>
      </HashRouter>
    </AuthProvider>
  );
}
