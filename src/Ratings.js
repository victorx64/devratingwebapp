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
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return (
            <>
                <h1 className="mt-5">Обновление рейтинга</h1>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Ид.</th>
                            <td>{rating.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Автор</th>
                            <td><Link to={/authors/ + rating.AuthorId}>{rating.AuthorEmail}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Предыдущий рейтинг</th>
                            {
                                rating.PreviousRatingId
                                    ? <td><Link to={/ratings/ + rating.PreviousRatingId}>{rating.PreviousRating?.toFixed(2)}</Link></td>
                                    : <td>1500 (по умолчанию)</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Новый рейтинг</th>
                            <td>{rating.Value?.toFixed(2)}</td>
                        </tr>
                        {
                            rating.CountedDeletions
                                ? <tr><th scope="row">Удаленных строк автора</th><td>{rating.CountedDeletions}</td></tr>
                                : ''
                        }
                        {
                            rating.IgnoredDeletions
                                ? <tr><th scope="row">Удаленных строк автора (написанных в прошлых релизах)</th><td>{rating.IgnoredDeletions}</td></tr>
                                : ''
                        }
                        <tr>
                            <th scope="row">Создано в работе</th>
                            <td><Link to={/works/ + rating.WorkId}>[W&#8209;{rating.WorkId}]</Link></td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}