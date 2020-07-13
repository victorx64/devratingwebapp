import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import _ from "lodash";

import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ScatterChart,
    Scatter,
    ReferenceLine,
} from 'recharts';

const defaultRating = 1500;

// function WorkEffort(work) {
//     return (work.Additions / (
//         1 -
//         Math.pow(10, (work.UsedRatingId ? work.UsedRating : defaultRating) / 400) /
//         (
//             Math.pow(10, (work.UsedRatingId ? work.UsedRating : defaultRating) / 400) +
//             Math.pow(10, defaultRating / 400)
//         )
//     )).toFixed();
// }

function Scatters(works) {
    const authors = _.groupBy(works, (value) => (value.AuthorEmail));

    const colors = [
        '#1eb7ff',
        '#ca8eff',
        '#6610f2',
        '#1bb934',
        '#f27212',
        '#ed1c24',
        '#e83e8c'];

    return Object.entries(authors).map(([a, w], i) => {
        w.forEach(element => {
            if (!element.UsedRating) {
                element.UsedRating = defaultRating;
            }
        });

        return (<Scatter key={a} name={a} data={w} fill={colors[i % colors.length]} />);
    });
}

export default function LastWorks(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [works, setWorks] = useState([]);
    const repository = props.repository;

    useEffect(() => {
        const after = new Date();
        after.setDate(after.getDate() - 90);

        fetch("https://devrating.azurewebsites.net/api/works?repository=" + repository +
            "&after=" + after.toISOString())
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setWorks(result);
                },
                (error) => {
                    setLoaded(true);
                    setError(error);
                }
            )
    }, [repository]);

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
            {
                work.UsedRatingId
                    ? <td className="text-right"><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating?.toFixed(2)}</Link></td>
                    : <td className="text-right">{defaultRating.toFixed(2)}</td>
            }
            <td className="text-right">{work.Additions}</td>
            {/* <td className="text-right">{WorkEffort(work)}</td> */}
            <td>{new Date(work.CreatedAt).toLocaleDateString()}</td>
        </tr>
    );

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading recent works...</div>;
    } else {
        return (
            <React.Fragment>
                <h2>Recent Works</h2>
                <p className="lead">
                    The more dots of the programmer is in the upper left
                    corner — the more easy-to-test and valuable work the
                    programmer has performed.
                </p>
                <div className='overflow-auto'>
                    <ResponsiveContainer width='100%' minWidth={720} aspect={2.5 / 1.0}>
                        <ScatterChart>
                            <XAxis
                                type="number"
                                dataKey={'Additions'}
                                name='New lines'
                                domain={[0, 'dataMax']}
                                label={{ value: 'New lines in work', offset: 0, position: 'insideBottom' }} />
                            <YAxis
                                type="number"
                                dataKey={'UsedRating'}
                                name='Rating'
                                domain={[500, 2500]}
                                label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} />
                            <CartesianGrid strokeDasharray="3 3" />

                            <ReferenceLine
                                y={1690}
                                label={{ value: '"Top developer"', position: 'top' }}
                                stroke="#1eb7ff"
                                strokeDasharray="5" />
                            <ReferenceLine
                                y={1310}
                                label={{ value: '"Good developer"', position: 'top' }}
                                stroke="#1bb934"
                                strokeDasharray="5" />
                            <ReferenceLine
                                x={250}
                                label={{ value: '250 lines threshold', position: 'insideBottomLeft' }}
                                stroke="#e83e8c"
                                strokeDasharray="5" />
                            <Tooltip />
                            <Legend />
                            {Scatters(works)}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <p>
                    This graph shows the size of pull requests (horizontal
                    axis) and the rating of their authors (vertical axis).
                    The smaller the pull request, the higher the likelihood
                    of a thorough code review. The larger the size of the
                    pull request, the higher the chance of missing an
                    unwanted code.
                </p>
                <div className="table-responsive mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Work</th>
                                <th scope="col">Pull request</th>
                                <th scope="col">Author</th>
                                <th scope="col" className="text-right">Rating</th>
                                <th scope="col" className="text-right">New lines</th>
                                {/* <th scope="col" className="text-right">Effort</th> */}
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
    }
}
