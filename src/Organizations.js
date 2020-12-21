import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth.js";

export default function Organizations(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [organizations, setOrganizations] = useState([]);

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        currentUser.getIdToken().then(t => {
            fetch("https://localhost:5001/organizations/", {
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
                    (error) => {
                        setLoaded(true);
                        setError(error);
                    }
                )
        })
    }, [currentUser]);

    if (error) {
        return <div>Error: {error.message}</div>;
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
                <h2>My Organizations</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
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
