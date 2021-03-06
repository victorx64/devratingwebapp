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

const weeks = 10
const days = weeks * 7
const msPerDay = 1000 * 60 * 60 * 24
const msPerWeek = 1000 * 60 * 60 * 24 * 7

const colors = [
    "#1eb7ff",
    "#ca8eff",
    "#6610f2",
    "#1bb934",
    "#f27212",
    "#ed1c24",
    "#e83e8c",
    "#6c757d", // gray
    "#343a40", // gray-dark
    "#007bff", // blue
    "#6610f2", // indigo
    // "#6f42c1", // purple
    // "#e83e8c", // pink
    "#dc3545", // red
    "#fd7e14", // orange
    "#ffc107", // yellow
    "#28a745", // green
    // "#20c997", // teal
    "#17a2b8", // cyan
]

function RatingsData(works) {
    const today = new Date()
    const worksPerDay = _.groupBy(works, w => (Math.floor((today - new Date(w.CreatedAt)) / msPerDay)))

    const result = Array(days).fill({}).map(
        (item, index) => (
            {
                Day: index
            }
        )
    );

    Object.entries(worksPerDay).forEach(
        ([day, worksOfDay]) => {
            if (result[day]) {
                result[day]['Delta'] = worksOfDay.filter(work => work.NewRating)
                    .reduce((accum, current) => accum + current.NewRating - (current.UsedRating ?? DefaultRating), 0)

                worksOfDay.reverse()
                    .forEach(
                        work => work.Ratings.forEach(
                            r => {
                                result[day][r.AuthorEmail] = r.Value
                            }
                        )
                    )
            }
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

function ExperiencesData(works, period, count) {
    const today = new Date()
    const worksPerDay = _.groupBy(works, w => (Math.floor((today - new Date(w.CreatedAt)) / period)))

    const result = Array(count).fill({}).map(
        (item, index) => (
            {
                Day: index
            }
        )
    );

    Object.entries(worksPerDay).forEach(
        ([day, worksOfDay]) => {
            if (result[day]) {
                worksOfDay.forEach(
                    work => {
                        result[day][work.AuthorEmail] = (result[day][work.AuthorEmail] ?? 0) + GainedExperience(work)
                    }
                )
            }
        }
    )

    return result.reverse()
}

function AccumulatedExperiencesData(experiencesData) {
    const accum = {}

    const result = experiencesData.map(
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
                isAnimationActive={false}
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
            <Bar isAnimationActive={false} stackId="b" key={a} dataKey={a} fill={colors[i % colors.length]} name={a} />
        )
    )
}

function WorkScatters(works) {
    const authors = _.groupBy(works, (value) => (value.AuthorEmail))
    return Object.entries(authors).map(([a, w], i) => {
        w.forEach(
            element => {
                if (!element.UsedRating) {
                    element.UsedRating = DefaultRating
                }
            }
        )
        return (<Scatter isAnimationActive={true}
            key={a}
            name={a}
            data={w}
            fill={colors[i % colors.length]}
        />)
    })
}

function DaysAgoToDateString(daysAgo) {
    const today = new Date()
    today.setUTCDate(today.getUTCDate() - daysAgo)
    return today.toLocaleDateString()
}

function WeeksAgoToDateString(weeksAgo) {
    const today = new Date()
    today.setUTCDate(today.getUTCDate() - weeksAgo * 7)
    return today.toLocaleDateString()
}

function WeeksAgoToString(weeksAgo) {
    const start = new Date()
    start.setUTCDate(start.getUTCDate() - weeksAgo * 7 - 7)
    const end = new Date()
    end.setUTCDate(end.getUTCDate() - weeksAgo * 7)
    return start.toLocaleDateString() + ' – ' + end.toLocaleDateString()
}

function ToFixedTwo(n) {
    return n.toFixed(2)
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
        return <div className="mt-4">Error: {error.message ?? error.status}</div>
    } else if (works) {
        const experienceBars = ExperienceBars(works)
        const experiencesPerWeekData = ExperiencesData(works, msPerWeek, weeks)
        const experiencesPerDayData = ExperiencesData(works, msPerDay, days)
        const ratingsData = RatingsData(works)
        const accumulatedExperiencesData = AccumulatedExperiencesData(experiencesPerDayData)
        const workScatters = WorkScatters(works)

        return (
            <React.Fragment>
                <h1 className="mt-4">{decodeURIComponent(repo)}</h1>
                <h2>Stability Rating</h2>
                <p className="lead">
                    The higher the code stability, 
                    the higher the rating of a programmer.
                </p>
                <p>
                    Each code change requires additional development time. 
                    The diagram below shows the frequency of changing the 
                    code of each programmer. Each deleted line increases the rating 
                    of the programmer and decreases the rating of the author of the deleted line.
                </p>
                <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                    <ComposedChart data={ratingsData} margin={{ top: 20, bottom: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Day" tickFormatter={DaysAgoToDateString} />
                        <YAxis
                            yAxisId="left"
                            domain={[1000, 2000]}
                            label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                        <YAxis yAxisId="right" domain={[0, 1000]} hide={true} orientation="right" />
                        <Tooltip labelFormatter={DaysAgoToDateString} formatter={ToFixedTwo} />
                        <Bar stackId="a" yAxisId="right" dataKey="Delta" name="Rating drop" fill="#999" />
                        {RatingLines(works)}
                        <Legend />
                    </ComposedChart>
                </ResponsiveContainer>
                <h2>Pull requests size and stability distribution</h2>
                <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                    <ScatterChart margin={{ top: 20, bottom: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="Additions"
                            name="New lines"
                            label={{ value: "New lines", offset: -5, position: "insideBottom" }} />
                        <YAxis
                            type="number"
                            dataKey="UsedRating"
                            name="Rating"
                            domain={[1000, 2000]}
                            label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={ToFixedTwo} />
                        <Legend />
                        {workScatters}
                    </ScatterChart>
                </ResponsiveContainer>
                <h2>Pull requests impact</h2>
                <p className="lead">
                    Knowing the size and expected stability of each Pull request we evaluate
                    the Experience Points (XP) of authors for the impact on the codebase.
                </p>
                <p>
                    See the details of a PR to learn how the XP is calculated.
                </p>
                <h3>By days</h3>
                <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                    <BarChart data={experiencesPerDayData} margin={{ top: 20, bottom: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Day" tickFormatter={DaysAgoToDateString} />
                        <YAxis label={{ value: "+XP per day", angle: -90, position: "insideLeft" }} />
                        <Tooltip labelFormatter={DaysAgoToDateString} formatter={ToFixedTwo} />
                        {experienceBars}
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
                <h3>By weeks</h3>
                <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                    <BarChart data={experiencesPerWeekData} margin={{ top: 20, bottom: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Day" tickFormatter={WeeksAgoToDateString} />
                        <YAxis label={{ value: "+XP per week", angle: -90, position: "insideLeft" }} />
                        <Tooltip labelFormatter={WeeksAgoToString} formatter={ToFixedTwo} />
                        {experienceBars}
                        <Legend />
                    </BarChart>
                </ResponsiveContainer>
                <h3>Accumulated impact</h3>
                <ResponsiveContainer minWidth={700} aspect={2.0 / 1.0}>
                    <AreaChart data={accumulatedExperiencesData} margin={{ top: 20, bottom: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="Day" tickFormatter={DaysAgoToDateString} />
                        <YAxis label={{ value: "Accumulated XP", angle: -90, position: "insideLeft" }} />
                        <Tooltip labelFormatter={DaysAgoToDateString} formatter={ToFixedTwo} />
                        <Legend />
                        {AccumulatedExperienceAreas(works)}
                    </AreaChart>
                </ResponsiveContainer>
                <div className="table my-3">
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
        return <div className="mt-4">Loading recent works...</div>
    }
}
