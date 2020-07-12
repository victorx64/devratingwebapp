import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

import {
    AreaChart,
    Area,
    YAxis,
} from 'recharts';

function BadgeFunction(author) {
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
            <td className="align-middle">
                <Link to={/ratings/ + author.RatingId}>{author.Rating?.toFixed(2)}</Link>
            </td>
            <td className="align-middle">
                <FontAwesomeIcon icon={faCircle} className={"text-" + color + " mr-2"} />
                {text}
            </td>
        </React.Fragment>
    );
}

export default function Leaderboard(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [authors, setAuthors] = useState([]);
    const repository = props.repository;

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/authors/?repository=" + repository)
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setAuthors(result);
                },
                (error) => {
                    setLoaded(true);
                    setError(error);
                }
            )
    }, [repository]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading repository authors...</div>;
    } else {
        const rows = authors.map((author, index, array) =>
            <tr key={author.Id}>
                <th scope="row">{index + 1}</th>
                <td>
                    <Link to={/authors/ + author.Id}>{author.Email}</Link>
                </td>
                <td className="align-middle">
                    <AreaChart
                        width={240}
                        height={30}
                        data={
                            author.ratings?.map(r => ({
                                createdAt: new Date(r.CreatedAt).getTime(),
                                value: r.Value?.toFixed(2)
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
                <p>
                    Each code change is an extra development time. The list 
                    below shows the rarity of changing the code of each 
                    programmer. It is based on the history of deleting 
                    lines of code. Each deleted line increases the rating 
                    of the programmer and decreases the rating of the 
                    author of the deleted line.
                </p>
                <p className="lead">
                    The higher the rating of the programmer, 
                    the higher the value of the code.
                </p>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Rank</th>
                                <th scope="col">Author</th>
                                <th scope="col">Graph (90d)</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}