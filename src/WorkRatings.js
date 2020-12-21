import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function WorkRatings(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [ratings, setRatings] = useState([]);
    const id = props.workId;
    const hideIgnoredDeletions = props.hideIgnoredDeletions;

    useEffect(() => {
        fetch("https://localhost:5001/ratings/works/" + id)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setLoaded(true);
                    setRatings(result);
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
        const rows = ratings.filter(rating => rating.CountedDeletions).map((rating) =>
            <tr key={rating.Id}>
                <td>
                    <Link to={/authors/ + rating.AuthorId}>{rating.AuthorEmail}</Link>
                </td>
                <td>{rating.CountedDeletions}</td>
                {
                    rating.IgnoredDeletions
                        ? <td>{rating.IgnoredDeletions}</td>
                        : hideIgnoredDeletions
                            ? ''
                            : <td>none</td>
                }
                {
                    rating.PreviousRatingId
                        ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating?.toFixed(2)}</Link></td>
                        : <td>{(1500).toFixed(2)} (initial)</td>
                }

                <td><Link to={/ratings/ + rating.Id}>{rating.Value?.toFixed(2)}</Link></td>
            </tr>);

        return (
            <>
                <h4>Deleted lines authors</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Author</th>
                            <th scope="col">Lines lost</th>
                            <th scope="col" hidden={hideIgnoredDeletions}>Lines lost (written before update)</th>
                            <th scope="col">Rating before</th>
                            <th scope="col">Rating after</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </>
        );
    }
}