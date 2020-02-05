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
                <h4>Work details</h4>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Id</th>
                            <td>{work.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Repository</th>
                            <td>
                                {work.Repository} <Link to={'/' + work.Repository}>[Leaderboard]</Link>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Pull request</th>
                            {
                                work.Link
                                    ? <td><Link to={work.Link}>{work.Link}</Link></td>
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
                            <th scope="row">Author</th>
                            <td><Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Additions</th>
                            <td>{work.Additions}</td>
                        </tr>
                        <tr>
                            <th scope="row">Rating before</th>
                            {
                                work.UsedRatingId
                                    ? <td><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating}</Link></td>
                                    : <td>default</td>
                            }
                        </tr>
                    </tbody>
                </table>
                <WorkRatings workId={id} />
            </>
        );
    }
}