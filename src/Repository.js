import { useParams, Link } from "react-router-dom";
import './App.css';
import React, { useState, useEffect } from "react"
import _ from "lodash"
import { host } from "./config.js"
import { GainedExperience, RatingDelta, DefaultRating } from "./Formula.js"
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
    BarChart,
    ScatterChart,
    Scatter,
    AreaChart,
    Area,
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
    const today = new Date()
    const worksPerDay = _.groupBy(works, w => (Math.floor((today - new Date(w.CreatedAt)) / 86400000)))

    const result = Array(days + 1).fill({}).map(
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

function AccumulatedExperiencesData(works) {
    const accum = {}

    const result = ExperiencesData(works).map(
        item => {
            Object.entries(item)
                .forEach(([author, xp]) => accum[author] = (accum[author] ?? 0) + xp)

            const dayXp = {}

            Object.assign(dayXp, accum)

            dayXp.Day = item.Day

            return dayXp
        }
    );

    return result
}

function AccumulatedExperienceAreas(works) {
    const authors = _.uniq(works.map((value) => (value.AuthorEmail)))

    return authors.map(
        (a, i) =>
        (
            <Area type="monotone"
                key={a}
                dataKey={a}
                stackId="1"
                name={a}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]} />
        )
    )
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

function ToDate(daysAgo) {
    const today = new Date()
    today.setUTCDate(today.getUTCDate() - daysAgo)
    return today
}

export default function Repository() {
    const [error, setError] = useState(null)
    const [works, setWorks] = useState(null)
    const { organization, repo } = useParams();

    useEffect(() => {
        const after = new Date()
        after.setUTCDate(after.getUTCDate() - days)
        after.setUTCHours(0)
        after.setUTCMinutes(0)
        after.setUTCSeconds(0)
        after.setUTCMilliseconds(0)

        fetch(host + "/works/?organization=" + organization + "&repository=" +
            repo + "&after=" + after.toISOString())
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(
                (result) => {
                    setWorks(result)
                },
                (error) => {
                    setError(error)
                }
            )
    }, [organization, repo])

    if (error) {
        return <div><br />Error: {error.message ?? error.status}</div>
    } else if (works) {
        return (
            <React.Fragment>
                <h1 className="mt-4">{decodeURIComponent(repo)} contributors</h1>
                <div className="overflow-auto">
                    <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                        <BarChart data={ExperiencesData(works)} margin={{ top: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="Day" tickFormatter={d => ToDate(d).toLocaleDateString()} />
                            <YAxis label={{ value: "+XP", angle: -90, position: "insideLeft" }} />
                            <Tooltip labelFormatter={d => ToDate(d).toLocaleDateString()} formatter={value => value.toFixed(2)} />
                            {ExperienceBars(works)}
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                        <AreaChart data={AccumulatedExperiencesData(works)}
                            margin={{ top: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="Day" tickFormatter={d => ToDate(d).toLocaleDateString()} />
                            <YAxis label={{ value: "Accumulated XP", angle: -90, position: "insideLeft" }} />
                            <Tooltip labelFormatter={d => ToDate(d).toLocaleDateString()} formatter={value => value.toFixed(2)} />
                            <Legend />
                            {AccumulatedExperienceAreas(works)}
                        </AreaChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                        <ComposedChart data={RatingsData(works)} margin={{ top: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="Day" tickFormatter={d => ToDate(d).toLocaleDateString()} />
                            <YAxis
                                yAxisId="left"
                                domain={[1000, 2000]}
                                label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                            <YAxis yAxisId="right" domain={[0, 1000]} hide={true} orientation="right" />
                            <Tooltip labelFormatter={d => ToDate(d).toLocaleDateString()} formatter={value => value.toFixed(2)} />
                            <Bar stackId="a" yAxisId="right" dataKey="Delta" name="Rating drop" fill="#999" />
                            {RatingLines(works)}
                            <Legend />
                        </ComposedChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                        <ScatterChart margin={{ top: 20, bottom: 20 }}>
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
                </div>
                <div className="table-responsive my-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Work</th>
                                <th scope="col">Author</th>
                                <th scope="col">Pull request</th>
                                <th scope="col">Merged at</th>
                                <th scope="col" className="text-right">+Rating</th>
                                <th scope="col" className="text-right">+XP</th>
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
                                        <td className="text-right">{RatingDelta(work).toFixed(2)}</td>
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
