import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth.js";
import { host } from './config.js';

export default function Organizations(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [name, setName] = useState(undefined);
    const [diff, setDiff] = useState(undefined);
    const [jwt, setJwt] = useState(null);
    const { currentUser } = useContext(AuthContext);

    function FetchOrgs(t) {
        if (t) {
            fetch(host + "/organizations/", {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + t
                }
            })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(
                    (result) => {
                        setLoaded(true);
                        setOrganizations(result);
                    },
                    setError
                )
        }
    }

    useEffect(() => { currentUser.getIdToken().then(setJwt) }, [currentUser]);
    useEffect(() => { FetchOrgs(jwt) }, [jwt]);

    const handleSubmitOrg = (evt) => {
        evt.preventDefault();

        fetch(host + "/organizations/" + encodeURIComponent(name), {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + jwt
            }
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    FetchOrgs(jwt);
                },
                setError
            )
    }

    const handleSubmitDiff = (evt) => {
        evt.preventDefault();

        fetch(host + "/diffs/", {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + jwt,
                'Content-Type': 'application/json'
            },
            body: diff
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    props.history.push('/works/' + result.Id);
                },
                setError
            )
    }

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        const rows = organizations.map((organization, index, array) =>
            <tr key={organization.Id}>
                <td className="align-middle">
                    <Link to={/organizations/ + encodeURIComponent(organization.Name)}>{organization.Name}</Link>
                </td>
            </tr>
        );

        return (
            <>
                <h1 className="mt-4">My Organizations</h1>
                <div className="table-responsive">
                    <table className="table">
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                <form className="mt-2" onSubmit={handleSubmitOrg}>
                    <div className="form-group">
                        <label htmlFor="inputName">Organization name</label>
                        <input type="text" className="form-control" id="inputName" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Create organization</button>
                </form>
                <form className="mt-4" onSubmit={handleSubmitDiff}>
                    <div className="form-group">
                        <label htmlFor="inputName">Diff metadata</label>
                        <textarea className="form-control" rows="20" value={diff} onChange={e => setDiff(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Apply diff</button>
                </form>
                <br />
            </>
        );
    }
}
