import React from 'react';
import { useParams } from "react-router-dom";
import Leaderboard from "./Leaderboard.js";
import LastWorks from './LastWorks.js';
import './App.css';

export default function Organization() {
    const { organization } = useParams();

    return (
        <>
            <h1 className="mt-4">Organization contributors</h1>
            <p>Current organization — <code>{decodeURIComponent(organization)}</code></p>
            <Leaderboard organization={organization} />
            <LastWorks organization={organization} />

            <br />
        </>
    );
}