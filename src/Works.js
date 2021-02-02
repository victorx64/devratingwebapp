import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { host } from './config.js';
import { LinesMultiplier, ProductiveImpact, LimitedAdditions } from "./Formula.js";

export default function Works() {
    const [error, setError] = useState(null);
    const [work, setWork] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(host + "/works/" + id)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setWork(result);
                },
                (error) => {
                    setError(error);
                }
            )
    }, [id]);

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (work) {
        const rows = work.Ratings.filter(rating => rating.CountedDeletions).map((rating) =>
            <tr key={rating.Id}>
                <td>
                    <Link to={/authors/ + rating.AuthorId}>{rating.AuthorEmail}</Link>
                </td>
                <td className="text-right">{rating.CountedDeletions}</td>
                {
                    rating.IgnoredDeletions
                        ? <td className="text-right">{rating.IgnoredDeletions}</td>
                        : work.SinceCommit
                            ? <td>none</td>
                            : <></>
                }
                {
                    rating.PreviousRatingId
                        ? <td className="text-right"><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating.toFixed(2)}</Link></td>
                        : <td className="text-right">{(1500).toFixed(2)} (initial)</td>
                }
                <td className="text-right"><Link to={/ratings/ + rating.Id}>{rating.Value.toFixed(2)}</Link></td>
            </tr>);

        return (
            <>
                <h1 className="mt-5">Work</h1>
                <table className="table">
                    <tbody>
                        <tr>
                            <th scope="row">Id</th>
                            <td>{work.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Repository</th>
                            <td>
                                {work.Repository}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Author</th>
                            <td><Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">New lines</th>
                            <td>{LimitedAdditions(work)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Multiplier</th>
                            <td>{LinesMultiplier(work.UsedRating).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Experience points</th>
                            <td>{ProductiveImpact(work).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th scope="row">Rating</th>
                            <td><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating.toFixed(2)}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">New Rating</th>
                            {
                                work.NewRating
                                    ? <td><Link to={/ratings/ + work.NewRatingId}>{work.NewRating.toFixed(2)}</Link></td>
                                    : <td></td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Pull request</th>
                            {
                                work.Link
                                    ? <td><a href={work.Link}>{work.Link}</a></td>
                                    : <td>none</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Start commit</th>
                            <td>{work.StartCommit}</td>
                        </tr>
                        <tr>
                            <th scope="row">End commit</th>
                            <td>{work.EndCommit}</td>
                        </tr>
                        <tr hidden={!work.SinceCommit}>
                            <th scope="row">Major update</th>
                            <td>{work.SinceCommit}</td>
                        </tr>
                        <tr>
                            <th scope="row">Finished at</th>
                            <td>{new Date(work.CreatedAt).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                <h4>Deleted lines authors</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Author</th>
                            <th scope="col" className="text-right">Lines lost</th>
                            <th scope="col" className="text-right">Rating</th>
                            <th scope="col" className="text-right" hidden={!work.SinceCommit}>Lines lost (from a previous release)</th>
                            <th scope="col" className="text-right">New Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <br />
                <p>
                    When a developer deletes a line, he increases his rating and lowers the rating of the deleted line author.
                </p>
                <p>
                    The <a href="https://en.wikipedia.org/wiki/Elo_rating_system">Elo rating system</a> is used with the following constants:
                    <br />
                    <var>k = 1;</var><br />
                    <var>n = 400;</var>
                </p>
                <p>
                    When the system meets a new author it sets <var>1500</var> rating points to him. This is an average rating of the system.
                </p>
            </>
        );
    }
    else {
        return <div>Loading...</div>;
    }
}