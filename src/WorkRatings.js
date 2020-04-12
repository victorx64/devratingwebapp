import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function WorkRatings(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [ratings, setRatings] = useState([]);
    const id = props.workId;
    const hideIgnoredDeletions = props.hideIgnoredDeletions;

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
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
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
                            : <td>нет</td>
                }
                {
                    rating.PreviousRatingId
                        ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating?.toFixed(2)}</Link></td>
                        : <td>1500 (по умолчанию)</td>
                }

                <td><Link to={/ratings/ + rating.Id}>{rating.Value?.toFixed(2)}</Link></td>
            </tr>);

        return (
            <>
                <h4>Авторы удаленных строк</h4>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Автор</th>
                            <th scope="col">Потерь строк</th>
                            <th scope="col" hidden={hideIgnoredDeletions}>Удаления строк старых релизов</th>
                            <th scope="col">Рейтинг до</th>
                            <th scope="col">Рейтинг после</th>
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