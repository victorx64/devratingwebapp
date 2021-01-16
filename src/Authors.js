import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { host } from './config.js';
import { RatingPercentile, RatingWithExpectedWinProbAgainstDefault } from "./Formula.js";

import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';

const ranks = [
    RatingWithExpectedWinProbAgainstDefault(1 / 7).toFixed(),
    RatingWithExpectedWinProbAgainstDefault(2 / 7).toFixed(),
    RatingWithExpectedWinProbAgainstDefault(3 / 7).toFixed(),
    RatingWithExpectedWinProbAgainstDefault(4 / 7).toFixed(),
    RatingWithExpectedWinProbAgainstDefault(5 / 7).toFixed(),
    RatingWithExpectedWinProbAgainstDefault(6 / 7).toFixed(),
];

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
        <>
            <img src={icons[rank]} alt={texts[rank]} width="32px" />&nbsp;
            {texts[rank]}
        </>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div>
                {new Date(label).toLocaleString()}
                <br />
                Rating: {payload[0].value.toFixed(2)}
                <br />
                Work: {payload[0].payload.WorkId}
            </div>
        );
    }

    return null;
};

export default function Authors() {
    const [error, setError] = useState(null);
    const [author, setAuthor] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(host + "/authors/" + id)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setAuthor(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }, [id]);

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (author) {
        return (
            <>
                <h1 className="mt-5">Author</h1>
                <table className="table">
                    <tbody>
                        <tr>
                            <th scope="row">Id</th>
                            <td>{author.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Email</th>
                            <td>{author.Email}</td>
                        </tr>
                        <tr>
                            <th scope="row">Organization</th>
                            <td>
                                <Link to={/organizations/ + encodeURIComponent(author.Organization)}>{author.Organization}</Link>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Current rating</th>
                            <td>{author.RatingId
                                ? <Link to={/ratings/ + author.RatingId}>{author.Rating.toFixed(2)}</Link>
                                : (1500).toFixed(2) + ' (initial)'}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Rank</th>
                            <td>{BadgeFunction(author)}</td>
                        </tr>
                    </tbody>
                </table>
                <h1 className="mt-5">Rating history</h1>
                <p>Of the last 90 days.</p>
                <ResponsiveContainer width='100%' aspect={3 / 1} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <AreaChart
                        data={
                            author.ratings.map(r => ({
                                CreatedAt: new Date(r.CreatedAt).getTime(),
                                Value: r.Value,
                                WorkId: r.WorkId
                            }))
                        }
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Tooltip wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #dcdcdc' }} content={<CustomTooltip />} />
                        <XAxis
                            dataKey="CreatedAt"
                            type="number"
                            name='Time'
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={unixTime => new Date(unixTime).toLocaleDateString()}
                            label={{ value: 'Time', offset: 0, position: 'insideBottom' }} />
                        <YAxis
                            domain={[1000, 2000]}
                            name="Rating"
                            label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} />
                        <ReferenceLine
                            y={1000}
                            label={{ value: 'Bronze', position: 'top' }} />
                        <ReferenceLine
                            y={ranks[0]}
                            label={{ value: 'Silver ' + ranks[0] + '...', position: 'top' }} />
                        <ReferenceLine
                            y={ranks[1]}
                            label={{ value: 'Gold ' + ranks[1] + '...', position: 'top' }} />
                        <ReferenceLine
                            y={ranks[2]}
                            label={{ value: 'Platinum ' + ranks[2] + '...', position: 'top' }} />
                        <ReferenceLine
                            y={ranks[3]}
                            label={{ value: 'Diamond ' + ranks[3] + '...', position: 'top' }} />
                        <ReferenceLine
                            y={ranks[4]}
                            label={{ value: 'Master ' + ranks[4] + '...', position: 'top' }} />
                        <ReferenceLine
                            y={ranks[5]}
                            label={{ value: 'Grandmaster ' + ranks[5] + '...', position: 'top' }} />
                        <Area
                            dataKey="Value"
                            name='Rating'
                            stroke={'rgba(30, 183, 255)'}
                            fill={'rgba(30, 183, 255, 0.6)'} />
                    </AreaChart >
                </ResponsiveContainer>
            </>
        );
    } else {
        return <div>Loading...</div>;
    }
}