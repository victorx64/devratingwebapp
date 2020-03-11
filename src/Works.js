import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import WorkRatings from "./WorkRatings.js";

export default function Works() {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [work, setWork] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/works/" + id)
            .then(res => res.json())
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
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                <h1 className="mt-5">Work</h1>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Id</th>
                            <td>{work.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Repository</th>
                            <td>
                                {work.Repository} <Link to={'/' + encodeURIComponent(work.Repository)}>[Leaderboard]</Link>
                            </td>
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
                            <th scope="row">Start Commit</th>
                            <td>{work.StartCommit}</td>
                        </tr>
                        <tr>
                            <th scope="row">End Commit</th>
                            <td>{work.EndCommit}</td>
                        </tr>
                        <tr>
                            <th scope="row">Major release</th>
                            {
                                work.SinceCommit
                                    ? <td>work.SinceCommit</td>
                                    : <td>none</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Author</th>
                            <td><Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Added</th>
                            <td>{work.Additions}</td>
                        </tr>
                        <tr>
                            <th scope="row">Rating before</th>
                            {
                                work.UsedRatingId
                                    ? <td><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating?.toFixed(2)}</Link></td>
                                    : <td>default</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Rating after</th>
                            {
                                <td><Link to={/ratings/ + work.NewRatingId}>{work.NewRating?.toFixed(2)}</Link></td>
                            }
                        </tr>
                    </tbody>
                </table>
                <WorkRatings workId={id} />
                <br />
            </>
        );
    }
}