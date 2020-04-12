import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

export default function Authors() {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [author, setAuthor] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/authors/" + id)
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setAuthor(result);
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
                <h1 className="mt-5">Автор</h1>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Ид.</th>
                            <td>{author.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Email</th>
                            <td>{author.Email}</td>
                        </tr>
                        <tr>
                            <th scope="row">Ид. владельца репозиториев</th>
                            <td>{author.Organization}</td>
                        </tr>
                        <tr>
                            <th scope="row">Текущий рейтинг</th>
                            <td>{author.RatingId
                                ? <Link to={/ratings/ + author.RatingId}>{author.Rating?.toFixed(2)}</Link>
                                : '1500 (по умолчанию)'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}