import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import WorkRatings from "./WorkRatings.js";
import { host } from './config.js';

export default function Works() {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [work, setWork] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetch(host + "/works/" + id)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setLoaded(true);
                    setWork(result);
                },
                (error) => {
                    setLoaded(true);
                    setError(error);
                }
            )
    }, [id]);

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
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
                            <td>{work.Additions}</td>
                        </tr>
                        <tr>
                            <th scope="row">Rating before</th>
                            {
                                work.UsedRatingId
                                    ? <td><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating?.toFixed(2)}</Link></td>
                                    : <td>{(1500).toFixed(2)} (initial)</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Rating after</th>
                            {
                                <td><Link to={/ratings/ + work.NewRatingId}>{work.NewRating?.toFixed(2)}</Link></td>
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
                    </tbody>
                </table>
                <WorkRatings workId={id} hideIgnoredDeletions={!work.SinceCommit} />
                <br />
            </>
        );
    }
}