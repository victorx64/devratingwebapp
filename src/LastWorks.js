import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import _ from "lodash"
import { host } from './config.js'
import { RatingDelta, ProductiveImpact } from "./Formula.js"

import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    BarChart
} from 'recharts'

const days = 90

function BarsData(works) {
    const authors = _.groupBy(works, (value) => (value.AuthorEmail))
    const reducer = (accumulator, currentValue) => accumulator + currentValue

    return Object.entries(authors).map(
        ([a, w]) => {
            return {
                name: a,
                pi: w.map(ProductiveImpact).reduce(reducer)
            }
        }
    )
}

export default function LastWorks(props) {
    const [error, setError] = useState(null)
    const [works, setWorks] = useState(null)
    const organization = props.organization

    useEffect(() => {
        const after = new Date()
        after.setDate(after.getDate() - days)
        after.setUTCHours(0)
        after.setUTCMinutes(0)
        after.setUTCSeconds(0)
        after.setUTCMilliseconds(0)

        fetch(host + "/works/organizations/" + organization +
            "/" + after.toISOString())
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setWorks(result)
                },
                (error) => {
                    setError(error)
                }
            )
    }, [organization])

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>
    } else if (works) {
        const rows = works.map((work) =>
            <tr key={work.Id}>
                <td>
                    <Link to={/works/ + work.Id}>[W{work.Id}]</Link>
                </td>
                <td>
                    <Link to={/authors/ + work.AuthorId}>{work.AuthorEmail}</Link>
                </td>
                <td>
                    <a href={work.Link}>{work.Link}</a>
                </td>
                <td className="text-right">{ProductiveImpact(work).toFixed(2)}</td>
                <td className="text-right">{RatingDelta(work).toFixed(2)}</td>
                <td>{new Date(work.CreatedAt).toLocaleDateString()}</td>
            </tr>
        )

        return (
            <React.Fragment>
                <h2>Recent Works</h2>
                <p className="lead">
                    The higher the bar — the more overall impact the
                    programmer has performed ({days}d).
                </p>
                <div className='overflow-auto'>
                    <ResponsiveContainer width='100%' minWidth={720} aspect={2.5 / 1.0}>
                        <BarChart data={BarsData(works)} stackOffset="sign">
                            <XAxis dataKey="name" />
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis label={{ value: 'Overall Experience (' + days + 'd)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={value => value.toFixed(2)} />
                            <Bar dataKey="pi" name="Experience" fill="#6f42c1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p>
                </p>
                <div className="table-responsive mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Work</th>
                                <th scope="col">Author</th>
                                <th scope="col">Pull request</th>
                                <th scope="col" className="text-right">+Experience</th>
                                <th scope="col" className="text-right">+Rating</th>
                                <th scope="col">Finished at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    } else {
        return <div>Loading recent works...</div>
    }
}
