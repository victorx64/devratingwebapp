import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function WorkRatings(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [ratings, setRatings] = useState([]);
    const id = props.workId;

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/ratings?work=" + id)
            .then(res => res.json())
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
        const rows = ratings.map((rating) =>
            <tr key={rating.Id}>
                <td>
                    <Link to={/authors/ + rating.AuthorId}>{rating.AuthorEmail}</Link>
                </td>

                {
                    rating.Deletions
                        ? <td>{rating.Deletions}</td>
                        : <td>N/A</td>
                }
                {
                    rating.PreviousRatingId
                        ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating}</Link></td>
                        : <td>default</td>
                }

                <td><Link to={/ratings/ + rating.Id}>{rating.Value}</Link></td>
            </tr>);

        return (
            <>
                <h4>Deleted lines authors</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Author</th>
                            <th scope="col">Deletions</th>
                            <th scope="col">Before</th>
                            <th scope="col">After</th>
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