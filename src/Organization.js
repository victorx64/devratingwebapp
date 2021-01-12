import React from 'react';
import { useParams, Link } from "react-router-dom";
import Leaderboard from "./Leaderboard.js";
import LastWorks from './LastWorks.js';
import './App.css';

export default function Organization() {
    const { organization } = useParams();

    return (
        <>
            <h1 className="mt-4">Organization contributors</h1>
            <p><code>{decodeURIComponent(organization)}</code> <Link to={'./' + organization + '/keys'}>API keys</Link></p>
            <Leaderboard organization={organization} />
            <LastWorks organization={organization} />
            <br />
        </>
    );
}