import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import _ from "lodash"
import { host } from "./config.js"
import { GainedExperience, DefaultRating } from "./Formula.js"

import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    Line,
    Legend,
    ComposedChart,
    ScatterChart,
    Scatter,
    BarChart,
} from "recharts"

const days = 90
const colors = [
    "#1eb7ff",
    "#ca8eff",
    "#6610f2",
    "#1bb934",
    "#f27212",
    "#ed1c24",
    "#e83e8c"
]

function RatingsData(works) {
    return works
        .filter(w => w.NewRating)
        .reverse()
        .map(w => {
            const obj = {
                Id: w.Id,
                Delta: w.NewRating - (w.UsedRating ?? DefaultRating),
                CreatedAt: new Date(w.CreatedAt).getTime(),
                Experience: GainedExperience(w)
            }

            obj[w.AuthorEmail] = w.NewRating

            w.Ratings.forEach(r => {
                obj[r.AuthorEmail] = r.Value
            })

            return obj
        })
}

function RatingLines(works) {
    const authors = _.uniq(works.map((value) => (value.AuthorEmail)))

    return authors.map(
        (a, i) =>
        (
            <Line connectNulls yAxisId="left" type="monotone" strokeWidth={2} dataKey={a} stroke={colors[i % colors.length]} />
        )
    )
}

function ExperiencesData(works) {
    return works
        .filter(w => w.NewRating)
        .reverse()
        .map(w => {
            const obj = {
                Id: w.Id,
                CreatedAt: new Date(w.CreatedAt).getTime()
            }

            obj[w.AuthorEmail] = GainedExperience(w)

            return obj
        })
}

function ExperienceBars(works) {
    const authors = _.uniq(works.map((value) => (value.AuthorEmail)))

    return authors.map(
        (a, i) =>
        (
            <Bar dataKey={a} fill={colors[i % colors.length]} name={a} />
        )
    )
}

function WorkScatters(works) {
    const authors = _.groupBy(works, (value) => (value.AuthorEmail))

    return Object.entries(authors).map(([a, w], i) => {
        w.forEach(element => {
            if (!element.UsedRating) {
                element.UsedRating = DefaultRating
            }

            element.Additions = Math.min(element.Additions, 1000)
        })

        return (<Scatter key={a} name={a} data={w} fill={colors[i % colors.length]} />)
    })
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
        return (
            <React.Fragment>
                <ResponsiveContainer width="100%" minWidth={720} aspect={2.0 / 1.0}>
                    <ComposedChart data={RatingsData(works)}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Id"
                            label={{ value: "Work Id", offset: -5, position: "insideBottom" }} />
                        <YAxis
                            yAxisId="left"
                            domain={[1000, 2000]}
                            label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                        <YAxis yAxisId="right" domain={[0, 1000]} hide={true} orientation="right" />
                        <Tooltip labelFormatter={w => "Work: [W" + w + "]"} formatter={value => value.toFixed(2)} />
                        <Bar yAxisId="right" dataKey="Delta" name="Rating drop" fill="#999" />
                        {RatingLines(works)}
                        <Legend />
                    </ComposedChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" minWidth={720} aspect={2.0 / 1.0}>
                    <BarChart data={ExperiencesData(works)} stack>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Id"
                            label={{ value: "Work Id", offset: -5, position: "insideBottom" }} />
                        <YAxis
                            type="number"
                            label={{ value: "Experience", angle: -90, position: "insideLeft" }} />
                        <Tooltip labelFormatter={w => "Work: [W" + w + "]"} formatter={value => value.toFixed(2)} />
                        {ExperienceBars(works)}
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" minWidth={720} aspect={2.0 / 1.0}>
                    <ScatterChart>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="Additions"
                            name="New lines"
                            domain={[0, 1000]}
                            label={{ value: "New lines", offset: -5, position: "insideBottom" }} />
                        <YAxis
                            type="number"
                            dataKey="UsedRating"
                            name="Rating"
                            domain={[1000, 2000]}
                            label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={value => value.toFixed(2)} />
                        <Legend />
                        {WorkScatters(works)}
                    </ScatterChart>
                </ResponsiveContainer>
                <div className="table-responsive mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Work</th>
                                <th scope="col">Author</th>
                                <th scope="col">Pull request</th>
                                <th scope="col">Finished at</th>
                                <th scope="col" className="text-right">+Experience</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                works.map((work) =>
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
                                        <td>{new Date(work.CreatedAt).toLocaleDateString()}</td>
                                        <td className="text-right">{GainedExperience(work).toFixed(2)}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    } else {
        return <div>Loading recent works...</div>
    }
}
