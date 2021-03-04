import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { host } from './config.js';
import { DefaultRating, LinesMultiplier } from "./Formula.js";

export default function Ratings() {
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(host + "/ratings/" + id)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setRating(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }, [id]);

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (rating) {
        return (
            <>
                <h1 className="mt-5">Rating update</h1>
                <table className="table">
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
                                    ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating.toFixed(2)}</Link></td>
                                    : <td>{DefaultRating.toFixed(2)} (initial)</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Previous multiplier</th>
                             <td>{LinesMultiplier(rating.PreviousRating).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th scope="row">New rating</th>
                            <td>{rating.Value.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th scope="row">New multiplier</th>
                            <td>{LinesMultiplier(rating.Value).toFixed(2)}</td>
                        </tr>
                        <tr hidden={!rating.CountedDeletions}>
                            <th scope="row">Lines lost</th>
                            <td>{rating.CountedDeletions}</td>
                        </tr>
                        <tr hidden={!rating.IgnoredDeletions}>
                            <th scope="row">Lines lost (written before the major update)</th>
                            <td>{rating.IgnoredDeletions}</td>
                        </tr>
                        <tr>
                            <th scope="row">Updated by Work</th>
                            <td><Link to={/works/ + rating.WorkId}>[W{rating.WorkId}]</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Updated at</th>
                            <td>{new Date(rating.CreatedAt).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    } else {
        return <div>Loading...</div>;
    }
}