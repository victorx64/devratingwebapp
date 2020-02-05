import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Home from './Home.js';
import Policy from './Policy.js';
import Authors from './Authors.js';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/authors/:id">
          <Authors />
        </Route>
        <Route path="/works">
          <Works />
        </Route>
        <Route path="/ratings">
          <Ratings />
        </Route>
        <Route path="/policy">
          <Policy />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <span className="text-muted col-3">Copyright © Victor Semenov 2020</span>
            <Link className="col-3" to="/policy">Policy</Link >
          </div>
        </div>
      </footer>
    </Router>
  );
}

function Works() {
  return <h2>Works</h2>;
}

function Ratings() {
  return <h2>Ratings</h2>;
}
