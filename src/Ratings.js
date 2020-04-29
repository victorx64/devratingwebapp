import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

export default function Ratings() {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [rating, setRating] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/ratings/" + id)
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setRating(result);
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
                <h1 className="mt-5">Rating update</h1>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Id</th>
                            <td>{rating.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Author</th>
                            <td><Link to={/authors/ + rating.AuthorId}>{rating.AuthorEmail}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Previous rating</th>
                            {
                                rating.PreviousRatingId
                                    ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating?.toFixed(2)}</Link></td>
                                    : <td>{(1500).toFixed(2)} (initial)</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">New rating</th>
                            <td>{rating.Value?.toFixed(2)}</td>
                        </tr>
                        {
                            rating.CountedDeletions
                                ? <tr><th scope="row">Lines lost</th><td>{rating.CountedDeletions}</td></tr>
                                : ''
                        }
                        {
                            rating.IgnoredDeletions
                                ? <tr><th scope="row">Lines lost (written before the major update)</th><td>{rating.IgnoredDeletions}</td></tr>
                                : ''
                        }
                        <tr>
                            <th scope="row">Updated by Work</th>
                            <td><Link to={/works/ + rating.WorkId}>[W&#8209;{rating.WorkId}]</Link></td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}