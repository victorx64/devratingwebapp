import React, { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import Repository from "./Repository.js";
import './App.css';

export default function Home() {
    const { repository } = useParams();
    const [text, setText] = useState(repository && decodeURIComponent(repository));
    const handleChange = event => setText(event.target.value);

    return (
        <>
            <h1 className="mt-5">Dev Rating</h1>
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

            <form className="row pt-4 pt-2-sm">
                <div className="col-md-2 col-sm mb-2">
                    <label htmlFor="staticRepository" className="sr-only">Repository</label>
                    <input type="text" readOnly className="form-control-plaintext" id="staticRepository" value="Repository" />
                </div>
                <div className="col-sm mb-2">
                    <label htmlFor="inputRepository" className="sr-only">Repository</label>
                    <input type="url" className="form-control" id="inputRepository" placeholder="https://github.com/victorx64/devrating.git" value={text} onChange={handleChange} />
                </div>
                <Link type="button" className="btn btn-primary col-md-1 col-sm mx-3 mb-2" to={'/' + encodeURIComponent(text)}>Show</Link>
            </form>

            {repository && <Repository repository={repository} />}
        </>
    );
}