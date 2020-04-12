import React from 'react';
import { useParams } from "react-router-dom";
import Leaderboard from "./Leaderboard.js";
import LastWorks from './LastWorks.js';
import './App.css';

export default function Repo() {
    let { repository } = useParams();

    return (
        <>
            <Leaderboard repository={repository} />
            <LastWorks repository={repository} />

            <br />
        </>
    );
}