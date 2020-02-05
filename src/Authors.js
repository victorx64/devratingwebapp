import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';


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
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">Id</th>
                        <td>{author.Id}</td>
                    </tr>
                    <tr>
                        <th scope="row">Email</th>
                        <td>{author.Email}</td>
                    </tr>
                    <tr>
                        <th scope="row">Current Rating</th>
                        <td>{author.RatingId
                            ? author.Rating
                            : 'default'}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}