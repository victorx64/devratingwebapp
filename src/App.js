import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Home from './Home.js';

export default function App() {
  return (
    <>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Dev Rating</Link>
            </li>
            <li>
              <Link to="/repositories">Repositories</Link>
            </li>
            <li>
              <Link to="/authors">Authors</Link>
            </li>
            <li>
              <Link to="/works">Works</Link>
            </li>
            <li>
              <Link to="/ratings">Ratings</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/repositories">
            <Repositories />
          </Route>
          <Route path="/authors">
            <Authors />
          </Route>
          <Route path="/works">
            <Works />
          </Route>
          <Route path="/ratings">
            <Ratings />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>

      <footer className="footer">
        <div className="container">
          <span className="text-muted">Copyright © Victor Semenov 2020</span>
        </div>
      </footer>
    </>
  );
}

function Repositories() {
  return <h2>Repositories</h2>;
}

function Authors() {
  return <h2>Authors</h2>;
}

function Works() {
  return <h2>Works</h2>;
}

function Ratings() {
  return <h2>Ratings</h2>;
}
