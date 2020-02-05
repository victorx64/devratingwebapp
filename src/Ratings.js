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
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">Id</th>
                        <td>{rating.Id}</td>
                    </tr>
                    <tr>
                        <th scope="row">Value</th>
                        <td>{rating.Value}</td>
                    </tr>
                    <tr>
                        <th scope="row">Author's deleted lines</th>
                        {
                            rating.Deletions
                                ? <td>{rating.Deletions.Value}</td>
                                : <td>This is the work performer new rating</td>
                        }
                    </tr>
                    <tr>
                        <th scope="row">Author's previous Rating</th>
                        {
                            rating.PreviousRatingId
                                ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating}</Link></td>
                                : <td>default</td>
                        }
                    </tr>
                    <tr>
                        <th scope="row">Created by Work</th>
                        <td><Link to={/works/ + rating.WorkId}>[W&#8209;{rating.WorkId}]</Link></td>
                    </tr>
                    <tr>
                        <th scope="row">Author</th>
                        <td><Link to={/authors/ + rating.AuthorId}>{rating.AuthorEmail}</Link></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}