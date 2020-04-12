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
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return (
            <>
                <h1 className="mt-5">Работа</h1>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Ид.</th>
                            <td>{work.Id}</td>
                        </tr>
                        <tr>
                            <th scope="row">Репозиторий</th>
                            <td>
                                {work.Repository} <Link to={'/repo/' + encodeURIComponent(work.Repository)}>Подробнее...</Link>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Автор</th>
                            <td><Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link></td>
                        </tr>
                        <tr>
                            <th scope="row">Новые строки</th>
                            <td>{work.Additions}</td>
                        </tr>
                        <tr>
                            <th scope="row">Рейтинг до</th>
                            {
                                work.UsedRatingId
                                    ? <td><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating?.toFixed(2)}</Link></td>
                                    : <td>1500 (по умолчанию)</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Рейтинг после</th>
                            {
                                <td><Link to={/ratings/ + work.NewRatingId}>{work.NewRating?.toFixed(2)}</Link></td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Пулл Реквест</th>
                            {
                                work.Link
                                    ? <td><a href={work.Link}>{work.Link}</a></td>
                                    : <td>нет</td>
                            }
                        </tr>
                        <tr>
                            <th scope="row">Начальный коммит</th>
                            <td>{work.StartCommit}</td>
                        </tr>
                        <tr>
                            <th scope="row">Конечный коммит</th>
                            <td>{work.EndCommit}</td>
                        </tr>
                        {
                            work.SinceCommit
                                ? <tr><th scope="row">Мажорный релиз</th><td>{work.SinceCommit}</td></tr>
                                : ''
                        }
                    </tbody>
                </table>
                <WorkRatings workId={id} hideIgnoredDeletions={!work.SinceCommit} />
                <br />
            </>
        );
    }
}