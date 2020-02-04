import React from 'react';
import './App.css';

export default function Home() {
    return (
        <div className="container">
            <h1>Dev Rating</h1>
            <p>
                Dev Rating is a rating of software developers based on the stability of their code.
                <a href="https://github.com/victorx64/devrating/blob/master/docs/how-it-works.md"> Learn more...</a>
            </p>
            <p>
                Install <a href="https://github.com/marketplace/dev-rating">the app</a> to join the rating.<br />
                Read the <a href="https://github.com/victorx64/devrating/blob/master/docs/white-paper.md">white paper</a>.<br />
                Check out <a href="https://github.com/victorx64/devrating">the code</a>.
            </p>
            <p>
                Join our <a href="https://t.me/devratingchat">Telegram chat</a>.<br />
            </p>
            <div className="row alert alert-info" role="alert">
                The site is underway. Stay tuned!
            </div>
        </div>
    );
}