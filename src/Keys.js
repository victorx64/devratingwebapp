import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./Auth.js";
import { host } from './config.js';

export default function Keys(props) {
    const [error, setError] = useState(null);
    const [keys, setKeys] = useState(null);
    const [name, setName] = useState(undefined);
    const [value, setValue] = useState(undefined);
    const [jwt, setJwt] = useState(null);
    const { currentUser } = useContext(AuthContext);

    function FetchKeys(t) {
        if (t) {
            fetch(host + "/keys/", {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + t
                }
            })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(
                    (result) => {
                        setKeys(result);
                    },
                    (error) => {
                        setError(error);
                    }
                );
        }
    }

    useEffect(() => { currentUser.getIdToken().then(setJwt) }, [currentUser]);
    useEffect(() => { FetchKeys(jwt) }, [jwt]);

    const handleSubmit = (evt) => {
        evt.preventDefault();

        fetch(host + "/keys/", {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + jwt,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                value: value
            })
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    FetchKeys(jwt);
                },
                (error) => {
                    setError(error);
                }
            )
    }

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (keys) {
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
                <h1 className="mt-4">My Keys</h1>
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
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputName">Name</label>
                            <input type="text" className="form-control" id="inputName" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputValue">Value</label>
                            <input type="text" className="form-control" id="inputValue" value={value} onChange={e => setValue(e.target.value)} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add</button>
                </form>
            </>
        );
    } else {
        return <div>Loading...</div>;
    }
}
