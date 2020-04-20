import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function LastWorks(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [works, setWorks] = useState([]);
    const repository = props.repository;
    const description = props.description;
    const title = props.title ?? 'Недавние работы';

    useEffect(() => {
        fetch("https://devrating.azurewebsites.net/api/works?repository=" + repository)
            .then(res => res.json())
            .then(
                (result) => {
                    setLoaded(true);
                    setWorks(result);
                },
                (error) => {
                    setLoaded(true);
                    setError(error);
                }
            )
    }, [repository]);

    const rows = works.map((work) =>
        <tr key={work.Id}>
            <td>
                <Link to={/works/ + work.Id}>[W&#8209;{work.Id}]</Link>
            </td>
            {/* <td>
                <a href={work.Link}>{work.Link}</a>
            </td> */}
            <td>
                <Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link>
            </td>
            {
                work.UsedRatingId
                    ? <td><Link to={/ratings/ + work.UsedRatingId}>{work.UsedRating?.toFixed(2)}</Link></td>
                    : <td>default</td>
            }
            {/* <td>{work.Additions}</td> */}
            <td>
                {
                    (
                        work.Additions / (
                            1 -
                            Math.pow(10, (work.UsedRatingId ? work.UsedRating : 1500) / 400) /
                            (
                                Math.pow(10, (work.UsedRatingId ? work.UsedRating : 1500) / 400) +
                                Math.pow(10, 1500 / 400)
                            )
                        )
                    ).toFixed(2)
                }
            </td>
        </tr>
    );

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка недавних работ...</div>;
    } else {
        return (
            <>
                <h2 className="mt-3">{title}</h2>
                <p><code>{decodeURIComponent(repository)}</code>{description}</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            {/* <th scope="col">Пулл реквест</th> */}
                            <th scope="col">Автор</th>
                            <th scope="col">Рейтинг</th>
                            {/* <th scope="col">Новые строки</th> */}
                            <th scope="col">Объем</th>
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