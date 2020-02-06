import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function Repository(props) {
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
        return <div>Loading...</div>;
    } else {
        const rows = authors.map((author, index, array) =>
            <tr key={author.Id}>
                <th scope="row">{index + 1}</th>
                <td>
                    <Link to={/authors/ + author.Id}>{author.Email}</Link>
                </td>
                <td>
                    <Link to={/ratings/ + author.RatingId}>{author.Rating?.toFixed(2)}</Link>
                </td>
            </tr>
        );

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Author</th>
                        <th scope="col">Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}