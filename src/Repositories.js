import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Auth.js"
import { host } from "./config.js"

export default function Repositories() {
    const [error, setError] = useState(null)
    const [repositories, setRepositories] = useState(null)
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

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>
    } else if (repositories) {
        return (
            <>
                <h1 className="mt-4">Getting Started</h1>
                <p>
                    Create <Link to="/keys">API keys</Link> to connect GitHub or BitBucket
                </p>
                <h1 className="mt-4">My repositories</h1>
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
                <h1 className="mt-4">Sample repositories</h1>
                <div className="table-responsive">
                    <table className="table">
                        <tbody>
                            <tr>
                                <td className="align-middle">
                                    <Link to="/repositories/sgUj3bYc7wXTAXjF5DN0ON7lTTT2/cautious-eureka">
                                        cautious-eureka
                                </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    } else {
        return <div>Loading...</div>
    }
}
