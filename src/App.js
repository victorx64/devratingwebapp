import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import './App.css';
import Home from './Home.js';

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Dev Rating</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/repositories">Repositories</NavLink >
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/authors">Authors</NavLink >
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/works">Works</NavLink >
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" exact to="/ratings">Ratings</NavLink >
            </li>
          </ul>
        </div>
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

      <footer className="footer">
        <div className="container">
          <span className="text-muted">Copyright © Victor Semenov 2020</span>
        </div>
      </footer>
    </Router>
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
