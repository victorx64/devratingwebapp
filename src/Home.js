import React from 'react';
import { useParams } from "react-router-dom";
import Repository from "./Repository.js";
import LastWorks from './LastWorks.js';
import './App.css';

export default function Home() {
    let { repository } = useParams();
    let demo = '';

    if (!repository) {
        repository = encodeURIComponent('https://github.com/esphereal/aqua.git');
        demo = ' – demo repository'
    }

    return (
        <>
            <h1 className="mt-5">Dev Rating</h1>
            <p>
                A rating of software developers based on the stability of their code.
                <a href="https://github.com/victorx64/devrating/blob/master/docs/how-it-works.md"> Learn more...</a>
            </p>
            <p>
                Install <a href="https://github.com/marketplace/dev-rating">the app</a> to build your rating.<br />
                Read the <a href="https://github.com/victorx64/devrating/blob/master/docs/white-paper.md">white paper</a>.<br />
                Check out <a href="https://github.com/victorx64/devrating">the code</a>.
            </p>
            <p>
                Join our <a href="https://t.me/devratingchat">Telegram chat</a>.<br />
            </p>

            <h2 className="mt-3">Repository leaderboard</h2>
            <p><code>{decodeURIComponent(repository)}</code>{demo}</p>
            <Repository repository={repository} />

            <h2 className="mt-3">Repository recent works</h2>
            <p><code>{decodeURIComponent(repository)}</code>{demo}</p>
            <LastWorks repository={repository} />
        </>
    );
}