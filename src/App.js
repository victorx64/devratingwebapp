import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Home from './Home.js';
import Policy from './Policy.js';
import Authors from './Authors.js';
import Ratings from './Ratings.js';
import Works from './Works.js';

export default function App() {
  return (
    <HashRouter>
      <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          <img src="/dev-rating-30.png" width="30" height="30" className="d-inline-block align-top mr-3" alt="" />Dev Rating
        </Link>
      </nav>
      <div className="container">
        <Switch>
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
          <Route path="/:repository">
            <Home />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="row justify-content-center">
            <span className="text-muted col-auto">Copyright © Victor Semenov 2020</span>
            <Link className="col-auto" to="/policy">Policy</Link >
          </div>
        </div>
      </footer>
    </HashRouter>
  );
}
