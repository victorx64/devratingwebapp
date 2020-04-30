import React from 'react';
import Leaderboard from "./Leaderboard.js";
import LastWorks from './LastWorks.js';
import './App.css';

export default function Home() {
    return (
        <>
            <br />
            <h1>
                Developers Rating
            </h1>
            <p className="lead font-weight-normal">
                Each code fix is ​​the time wasted on finding the defect, fixing it, and retesting.
                Connect the service to your repository and get a rating of programmers by the rarity of fixing their code.
            </p>
            <p className="row justify-content-center">
                <a className="btn btn-primary" href="#form">Get the rating of your team</a>
            </p>
            <br />
            <h2>
                How the rating system can help you?
            </h2>
            <p className="lead font-weight-normal">
                The rating shows which of the programmers saves more time by writing code with the least number of defects.
                Use this service to motivate programmers to reduce software development time.
                The sooner the defect is fixed, <a href="https://www.ministryoftesting.com/dojo/lessons/ten-reasons-why-you-fix-bugs-as-soon-as-you-find-them">the cheaper</a> it will be.
                {/* <a href="https://deepsource.io/blog/exponential-cost-of-fixing-bugs/"></a> */}
            </p>
            <br />
            <Leaderboard repository={encodeURIComponent('https://github.com/esphereal/aqua.git')} description=' – demo repository' title='Sample rating' />
            <br />
            <h2>
                How do we build the rating?
            </h2>
            <p className="lead font-weight-normal">
                The rating is based on the history of code line deletions.
                Each correction of someone else's code increases the rating of the programmer and reduces the rating of the author of the corrected code.
                To increase his rating, the programmer needs to write code without defects and constantly improve the rest of the code.
                The rating shows how much the programmer follows the General Principle of Software Quality 
                (Steve McConnell, Code Complete, 2nd Edition, Chapter 20.5) and <a href="https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle">the open–closed principle</a>.
                Learn more about <a href="https://github.com/victorx64/devrating#how-it-works">how ranking is built...</a>
            </p>
            <br />
            <h2>
                How it improves the Code Churn metric?
            </h2>
            <p className="lead font-weight-normal">
                As well as the rating, Code Churn is based on the lines of code changes. It's a popular and one of the modern metrics of engineering team productivity.
                The problem of Code Churn that it is difficult to interpret it univocally. The value of the metric depends on a lot of factors.
                There is a post in <a href="https://www.pluralsight.com/blog/teams/6-causes-of-code-churn-and-what-you-should-do-about-them">Pluralsight's</a> blog 
                about the most common reasons for high Code Churn: unclear requirements, indecisive stakeholder, difficult problem,
                prototyping, polishing, and under-engagement. Also, Code Churn depends on the age of a project. Usually, the value stays
                high at the beginning of a project and slowly goes down.
            </p>
            <p className="lead font-weight-normal">
                Dev Rating is clear and has an unambiguous interpretation. The rating doesn't depend on the duration of a project and
                always shows the relative effectiveness of the developers.
            </p>
            <br />
            <h2>
                How does the ranking increase team motivation?
            </h2>
            <p className="lead font-weight-normal">
                Using a grading system, developers will know that every code improvement will be noted.
                An objective assessment of skills allows them to quickly prove themselves through a result of work.
                Encourage powerful programmers to create a team focused on the result.
            </p>
            <br />
            <LastWorks repository={encodeURIComponent('https://github.com/esphereal/aqua.git')} description=' – demo repository' title='Every merged Pull request updates the rating' />
            <br />
            <h2>
                How does this help distributed engineering teams?
            </h2>
            <p className="lead font-weight-normal">
                The service makes the progress of remote developers more visible.
                The faster and better the developer works, the higher will be his rating.
            </p>
            <br />
            <p className="row justify-content-center" id="form">
                <iframe scrolling="no" title="contact-form" src="https://docs.google.com/forms/d/e/1FAIpQLSdxhJ2olChHV-o0UAdAKo9l0h6jsoF6oE0btSpvhwLbpWfpZw/viewform?embedded=true" width="640" height="1405" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
            </p>
            <br />
        </>
    );
}
