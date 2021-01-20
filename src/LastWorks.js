import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import _ from "lodash";
import { host } from './config.js';
import { WorkLinesMultiplier } from "./Formula.js";

import {
    CartesianGrid,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Bar,
    BarChart
} from 'recharts';


function LimitedAdditions(additions, limit) {
    if (additions > limit) {
        return limit + '+';
    }

    return additions;
}

function Impact(work) {
    return Math.min(work.Additions, 250) * WorkLinesMultiplier(work);
}

function BarsData(works) {
    const authors = _.groupBy(works, (value) => (value.AuthorEmail));
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    return Object.entries(authors).map(
        ([a, w]) => {
            const obj = {};

            obj[a] = w.map(Impact).reduce(reducer);

            return obj;
        }
    );
}

function Bars(works) {
    const authors = _.uniq(works.map((value) => (value.AuthorEmail)));

    const colors = [
        '#1eb7ff',
        '#ca8eff',
        '#6610f2',
        '#1bb934',
        '#f27212',
        '#ed1c24',
        '#e83e8c'
    ];

    return authors.map(
        (a, i) => {
            return (<Bar dataKey={a} key={a} name={a} fill={colors[i % colors.length]} />);
        }
    );
}

export default function LastWorks(props) {
    const [error, setError] = useState(null);
    const [works, setWorks] = useState(null);
    const organization = props.organization;

    useEffect(() => {
        const after = new Date();
        after.setDate(after.getDate() - 90);
        after.setUTCHours(0)
        after.setUTCMinutes(0)
        after.setUTCSeconds(0)
        after.setUTCMilliseconds(0)

        fetch(host + "/works/organizations/" + organization +
            "/" + after.toISOString())
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setWorks(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }, [organization]);

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (works) {
        const rows = works.map((work) =>
            <tr key={work.Id}>
                <td>
                    <Link to={/works/ + work.Id}>[W{work.Id}]</Link>
                </td>
                <td>
                    <a href={work.Link}>{work.Link}</a>
                </td>
                <td>
                    <Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link>
                </td>
                <td className="text-right">{LimitedAdditions(work.Additions, 250)}</td>
                <td className="text-right">
                    {
                        work.UsedRatingId
                            ? <Link to={/ratings/ + work.UsedRatingId}>{WorkLinesMultiplier(work).toFixed(2)}</Link>
                            : WorkLinesMultiplier(work).toFixed(2)
                    }
                </td>
                <td className="text-right">{Impact(work).toFixed(2)}</td>
                <td>{new Date(work.CreatedAt).toLocaleDateString()}</td>
            </tr>
        );

        return (
            <React.Fragment>
                <h2>Recent Works</h2>
                <p className="lead">
                    The higher the bar — the more overall impact the
                    programmer has performed (90d).
                </p>
                <div className='overflow-auto'>
                    <ResponsiveContainer width='100%' minWidth={720} aspect={2.5 / 1.0}>
                        <BarChart data={BarsData(works)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis label={{ value: 'Overall Impact (90d)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip labelFormatter={() => ''} formatter={value => value.toFixed(2)} />
                            <Legend />
                            {Bars(works)}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p>
                </p>
                <div className="table-responsive mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Work</th>
                                <th scope="col">Pull request</th>
                                <th scope="col">Author</th>
                                <th scope="col" className="text-right">New lines</th>
                                <th scope="col" className="text-right">Multiplier</th>
                                <th scope="col" className="text-right">Impact</th>
                                <th scope="col">Finished at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    } else {
        return <div>Loading recent works...</div>;
    }
}
