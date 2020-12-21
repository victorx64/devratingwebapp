import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { AuthContext } from "./Auth.js";

export default function Keys(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [keys, setKeys] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { organization } = useParams();

    useEffect(() => {
        currentUser.getIdToken().then(t => {
            fetch("https://localhost:5001/keys/" + organization, {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + t
                }
            })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(
                    (result) => {
                        setLoaded(true);
                        setKeys(result);
                    },
                    (error) => {
                        setLoaded(true);
                        setError(error);
                    }
                );
        })
    }, [currentUser, organization]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        const rows = keys.map((key, index, array) =>
            <tr key={key.Id}>
                <th className="align-middle">
                    {key.Name}
                </th>
                <td className="align-middle">
                    {key.CreatedAt}
                </td>
                <td className="align-middle">
                    {key.RevokedAt}
                </td>
                <td className="align-middle">
                </td>
            </tr>
        );

        return (
            <>
                <h2>My Keys</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Created at</th>
                                <th scope="col">Revoked at</th>
                                <th scope="col">Revoke</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
