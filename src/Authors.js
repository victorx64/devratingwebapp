import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ReferenceLine
} from 'recharts';

function StatusFunction(author) {
    let color = "success";
    let text = "Good developer"

    if (author.Rating > 1500 + 190) {
        color = "primary";
        text = "Top developer";
    }

    if (author.Rating < 1500 - 190) {
        color = "warning";
        text = "Needs assistance";
    }

    return (
        <React.Fragment>
            <FontAwesomeIcon icon={faCircle} className={"text-" + color + " mr-2"} />
            {text}
        </React.Fragment>
    );
}

export default function Authors() {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [author, setAuthor] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/authors/" + id)
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setAuthor(result);
                },
                (error) => {
                    setLoaded(true);
                    setError(error);
                }
            )
    }, [id]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
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
                            <th scope="row">Repos owner Id</th>
                            <td>{author.Organization}</td>
                        </tr>
                        <tr>
                            <th scope="row">Current rating</th>
                            <td>{author.RatingId
                                ? <Link to={/ratings/ + author.RatingId}>{author.Rating?.toFixed(2)}</Link>
                                : (1500).toFixed(2) + ' (initial)'}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Status</th>
                            <td>{StatusFunction(author)}</td>
                        </tr>
                    </tbody>
                </table>
                <h1 className="mt-5">Rating history</h1>
                <p>Of the last 90 days.</p>
                <ResponsiveContainer width='100%' aspect={3 / 1} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <AreaChart
                        data={
                            author.ratings?.map(r => ({
                                createdAt: new Date(r.CreatedAt).getTime(),
                                value: r.Value?.toFixed(2)
                            }))}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis
                            dataKey="createdAt"
                            type="number"
                            name='Time'
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={unixTime => new Date(unixTime).toLocaleDateString()}
                            label={{ value: 'Time', offset: 0, position: 'insideBottom' }} />
                        <YAxis
                            domain={[500, 2500]}
                            name="Rating"
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
                        <Tooltip labelFormatter={unixTime => new Date(unixTime).toLocaleString()} />
                        <Area
                            dataKey="value"
                            name='Rating'
                            stroke={'rgba(30, 183, 255)'}
                            fill={'rgba(30, 183, 255, 0.6)'} />
                    </AreaChart >
                </ResponsiveContainer>
            </>
        );
    }
}