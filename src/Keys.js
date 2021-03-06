import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from "./Auth.js"
import { host } from './config.js'

export default function Keys() {
    const [error, setError] = useState(null)
    const [keys, setKeys] = useState(null)
    const [name, setName] = useState(undefined)
    const [value, setValue] = useState(undefined)
    const [jwt, setJwt] = useState(null)
    const { currentUser } = useContext(AuthContext)

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
                        setKeys(result)
                    },
                    (error) => {
                        setError(error)
                    }
                )
        }
    }

    useEffect(() => { currentUser.getIdToken().then(setJwt) }, [currentUser])
    useEffect(() => { FetchKeys(jwt) }, [jwt])

    const handleSubmit = (evt) => {
        evt.preventDefault()

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
                    FetchKeys(jwt)
                },
                (error) => {
                    setError(error)
                }
            )
    }

    if (error) {
        return <div className="mt-4">Error: {error.message ?? error.status}</div>
    } else if (keys) {
        return (
            <>
                <h1 className="mt-4">My Organization_ID</h1>
                <code>{currentUser.uid}</code>
                <h1 className="mt-4">My API_Keys</h1>
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
                            {
                                keys.map(
                                    (key) =>
                                        <tr key={key.Id}>
                                            <th className="align-middle">
                                                {key.Name}
                                            </th>
                                            <td className="align-middle">
                                                {new Date(key.CreatedAt).toLocaleString()}
                                            </td>
                                            <td className="align-middle">
                                                {key.RevokedAt && new Date(key.RevokedAt).toLocaleString()}
                                            </td>
                                            <td className="align-middle">
                                                <i>
                                                    Not implemented
                                                </i>
                                            </td>
                                        </tr>
                                )
                            }
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
                    <button type="submit" className="btn btn-primary">Add a new API_Key</button>
                </form>
                <h1 className="mt-4">GitHub Actions</h1>
                <p>
                    Just throw this to <code>.github/workflows/devrating.yml</code> in your repo:
                </p>
                <pre>{`name: Updating ranks in devrating.net
on:
  pull_request:
    branches: [ main ]  # Put your dev branch
    types: [ closed ]
jobs:
  devrating:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0  # Required to be 0
    - uses: victorx64/devrating-gh-action@v0
      with:
        devrating-organization: ${currentUser.uid}
        devrating-api-key: # Your API_Key`}
                </pre>
                <p>
                    Then, <b>close</b> a pull request to initiate the action.
                </p>
                <h1 className="mt-4">BitBucket Pipeline</h1>
                <p>
                    Add the following snippet to the script section of your <code>bitbucket-pipelines.yml</code> file:
                </p>
                <pre>{`script:
- pipe: docker://victorx64/devrating-bb-pipe:3.2.0
  variables:
    DEVRATING_ORGANIZATION: ${currentUser.uid}
    DEVRATING_KEY: # Your API_Key
    BITBUCKET_APP_PASSWORD: username:password # Your username and BitBucket App Password
    BASE_BRANCH: main # Put your dev branch`}
                </pre>
                <p>
                    Create BitBucket App Password in your <a href="https://bitbucket.org/account/settings/app-passwords/"
                    >account settings</a>.
                    Permit reading Pull requests.
                </p>
            </>
        )
    } else {
        return <div className="mt-4">Loading...</div>
    }
}
