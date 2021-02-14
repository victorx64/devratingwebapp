import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Auth.js"
import { host } from "./config.js"

export default function Repositories(props) {
    const [error, setError] = useState(null)
    const [repositories, setRepositories] = useState(null)
    const [diff, setDiff] = useState(undefined)
    const [jwt, setJwt] = useState(null)
    const { currentUser } = useContext(AuthContext)

    function FetchRepos(t) {
        if (t) {
            fetch(
                host + "/repositories/", {
                    method: "GET",
                    headers: {
                        "authorization": "Bearer " + t
                    }
                }
            )
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setRepositories(result)
                },
                setError
            )
        }
    }

    useEffect(() => { currentUser.getIdToken().then(setJwt) }, [currentUser])
    useEffect(() => { FetchRepos(jwt) }, [jwt])

    const handleSubmitDiff = (evt) => {
        evt.preventDefault()

        fetch(host + "/diffs/", {
            method: "POST",
            headers: {
                "authorization": "Bearer " + jwt,
                "Content-Type": "application/json"
            },
            body: diff
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    props.history.push("/works/" + result.Id)
                },
                setError
            )
    }

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>
    } else if (repositories) {
        return (
            <>
                <h1 className="mt-4">My repositories</h1>
                <Link to={"/keys"}>API keys</Link>
                <div className="table-responsive">
                    <table className="table">
                        <tbody>
                            {
                                repositories.map((repository, index) =>
                                    <tr key={index}>
                                        <td className="align-middle">
                                            <Link to={"/repositories/" + currentUser.uid + "/" + encodeURIComponent(repository)}>{repository}</Link>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <form className="mt-4" onSubmit={handleSubmitDiff}>
                    <div className="form-group">
                        <label htmlFor="inputName">Diff metadata</label>
                        <textarea className="form-control" rows="20" value={diff} onChange={e => setDiff(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Apply diff</button>
                </form>
                <br />
            </>
        )
    } else {
        return <div>Loading...</div>
    }
}
