import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { host } from './config.js';
import { RatingPercentile } from "./Formula.js";

import {
    AreaChart,
    Area,
    YAxis,
} from 'recharts';

const texts = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster',
];

const icons = [
    '/Competitive_Bronze_Icon.png',
    '/Competitive_Silver_Icon.png',
    '/Competitive_Gold_Icon.png',
    '/Competitive_Platinum_Icon.png',
    '/Competitive_Diamond_Icon.png',
    '/Competitive_Master_Icon.png',
    '/Competitive_Grandmaster_Icon.png',
];

function BadgeFunction(author) {
    const rank = Math.floor(RatingPercentile(author.Rating) * 7);

    return (
        <React.Fragment>
            <td className="align-middle">
                <Link to={/ratings/ + author.RatingId}>{author.Rating.toFixed(2)}</Link>
            </td>
            <td className="align-middle">
                <img src={icons[rank]} alt={texts[rank]} width="32px" />&nbsp;
                {texts[rank]}
            </td>
        </React.Fragment>
    );
}

export default function Leaderboard(props) {
    const [error, setError] = useState(null);
    const [authors, setAuthors] = useState(null);
    const organization = props.organization;

    useEffect(() => {
        const after = new Date();
        after.setDate(after.getDate() - 90);
        after.setUTCHours(0)
        after.setUTCMinutes(0)
        after.setUTCSeconds(0)
        after.setUTCMilliseconds(0)

        fetch(host + "/authors/organizations/" + organization +
            "/" + after.toISOString())
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setAuthors(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }, [organization]);

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (authors) {
        const rows = authors.map(author =>
            <tr key={author.Id}>
                <td className="align-middle">
                    <Link to={/authors/ + author.Id}>{author.Email}</Link>
                </td>
                <td className="align-middle">
                    <AreaChart
                        width={240}
                        height={30}
                        data={
                            author.ratings.map(r => ({
                                createdAt: new Date(r.CreatedAt).getTime(),
                                value: r.Value.toFixed(2)
                            }))}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <YAxis hide={true} domain={[1000, 2000]} />
                        <Area dataKey='value' stroke={'rgba(30, 183, 255)'} fill={'rgba(30, 183, 255, 0.6)'} />
                    </AreaChart>
                </td>
                {BadgeFunction(author)}
            </tr>
        );

        return (
            <>
                <h2>Authors</h2>
                <p className="lead">
                    The higher the rating of a programmer,
                    the higher the code stability.
                </p>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Author</th>
                                <th scope="col">Graph (90d)</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <p>
                    Each code change is an extra development time. The list
                    above shows the rarity of changing the code of each
                    programmer. It is based on the history of deleting
                    lines of code. Each deleted line increases the rating
                    of the programmer and decreases the rating of the
                    author of the deleted line.
                </p>
            </>
        );
    } else {
        return <div>Loading organization authors...</div>;
    }
}
