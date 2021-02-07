import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import _ from "lodash"
import { host } from "./config.js"
import { GainedExperience, DefaultRating } from "./Formula.js"
import ChordDiagram from 'react-chord-diagram'

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
    const worksPerDay = _.groupBy(works, w => (Math.floor((new Date() - new Date(w.CreatedAt)) / 86400000)))

    const result = Array(days+1).fill({}).map(
        (item, index) => (
            {
                Day: index
            }
        )
    );

    Object.entries(worksPerDay).forEach(
        ([day, worksOfDay]) => {
            result[day]['Delta'] = worksOfDay
                .filter(work => work.NewRating)
                .reduce((accum, current) => accum + current.NewRating - (current.UsedRating ?? DefaultRating), 0)

            worksOfDay
                .reverse()
                .forEach(
                    work => work.Ratings.forEach(
                        r => {
                            result[day][r.AuthorEmail] = r.Value
                        }
                    )
                )
        }
    )

    return result.reverse()
}

function RatingLines(works) {
    const authors = _.uniq(works.map((value) => (value.AuthorEmail)))

    return authors.map(
        (a, i) =>
        (
            <Line key={a} connectNulls yAxisId="left" type="monotone" strokeWidth={2} dataKey={a} stroke={colors[i % colors.length]} />
        )
    )
}

function ExperiencesData(works) {
    const worksPerDay = _.groupBy(works, w => (Math.floor((new Date() - new Date(w.CreatedAt)) / 86400000)))

    const result = Array(days + 1).fill({}).map(
        (item, index) => (
            {
                Day: index
            }
        )
    );

    Object.entries(worksPerDay).forEach(
        ([day, worksOfDay]) => {
            worksOfDay
                .forEach(
                    work => {
                        result[day][work.AuthorEmail] = (result[day][work.AuthorEmail] ?? 0) + GainedExperience(work)
                    }
                )
        }
    )

    return result.reverse()
}

function ExperienceBars(works) {
    const authors = _.uniq(works.map((value) => (value.AuthorEmail)))

    return authors.map(
        (a, i) =>
        (
            <Bar stackId="b" key={a} dataKey={a} fill={colors[i % colors.length]} name={a} />
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

function RatingStealMatrix(works) {
    const worksPerAuthor = _.groupBy(works, (value) => (value.AuthorEmail))
    const authors = Object.keys(worksPerAuthor)

    var matrix = Array.from(Array(authors.length), () => Array(authors.length).fill(0));

    Object.entries(worksPerAuthor).forEach(([a, w]) => {
        w.forEach(work => {
            const deletor = authors.indexOf(a)

            work.Ratings
                .filter(r => r.AuthorEmail !== work.AuthorEmail)
                .forEach(r => {
                    const drop = r.CountedDeletions
                    const victim = authors.indexOf(r.AuthorEmail)

                    matrix[deletor][victim] += drop
                })
        })
    })

    return matrix
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
        const authors = _.uniq(works.map((value) => (value.AuthorEmail)))

        return (
            <React.Fragment>
                <ResponsiveContainer width="100%" minWidth={720} aspect={2.0 / 1.0}>
                    <ComposedChart data={RatingsData(works)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5, }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Day"
                            label={{ value: "Days ago", offset: -5, position: "insideBottom" }} />
                        <YAxis
                            yAxisId="left"
                            domain={[1000, 2000]}
                            label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                        <YAxis yAxisId="right" domain={[0, 1000]} hide={true} orientation="right" />
                        <Tooltip labelFormatter={d => d + " days ago"} formatter={value => value.toFixed(2)} />
                        <Bar stackId="a" yAxisId="right" dataKey="Delta" name="Rating drop" fill="#999" />
                        {RatingLines(works)}
                        <Legend />
                    </ComposedChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" minWidth={720} aspect={2.0 / 1.0}>
                    <BarChart data={ExperiencesData(works)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5, }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Day"
                            label={{ value: "Days ago", offset: -5, position: "insideBottom" }} />
                        <YAxis
                            label={{ value: "Experience", angle: -90, position: "insideLeft" }} />
                        <Tooltip labelFormatter={d => d + " days ago"} formatter={value => value.toFixed(2)} />
                        {ExperienceBars(works)}
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" minWidth={720} aspect={2.0 / 1.0}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5, }}>
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
                <br />
                <div>The bigger the arc – the more lines of other devs the author has deleted:</div>
                <ChordDiagram
                    matrix={RatingStealMatrix(works)}
                    groupLabels={authors}
                    groupColors={colors}
                />
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
