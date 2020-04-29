import React from 'react';
import Leaderboard from "./Leaderboard.js";
import LastWorks from './LastWorks.js';
import './App.css';

export default function HomeRu() {
    return (
        <>
            <br />
            <h1>
                Рейтинг программистов
            </h1>
            <p className="lead font-weight-normal">
                Каждое исправление кода – это время, потраченное на нахождение дефекта, устранение дефекта и повторное тестирование.
                Подключи сервис к своему репозиторию и получи рейтинг программистов по редкости исправления их кода после написания.
            </p>
            <p className="row justify-content-center">
                <a className="btn btn-primary" href="#form">Получить рейтинг своей команды</a>
            </p>
            <br />
            <h2>
                Что дает рейтинг?
            </h2>
            <p className="lead font-weight-normal">
                Рейтинг показывает, кто из программистов больше экономит время, путем написания кода с наименьшим числом дефектов.
                Примените данный сервис для мотивации программистов сокращать время разработки ПО.
                Чем раньше исправляется дефект – <a href="https://tproger.ru/translations/ten-reasons-why-you-fix-bugs-as-soon-as-you-find-them/">тем дешевле</a> это обходится.
                {/* <a href="https://deepsource.io/blog/exponential-cost-of-fixing-bugs/"></a> */}
                {/* https://www.ministryoftesting.com/dojo/lessons/ten-reasons-why-you-fix-bugs-as-soon-as-you-find-them */}
            </p>
            <br />
            <Leaderboard repository={encodeURIComponent('https://github.com/esphereal/aqua.git')} description=' – демо-репозиторий' title='Пример рейтинга' />
            <br />
            <h2>
                Как строится рейтинг?
            </h2>
            <p className="lead font-weight-normal">
                Рейтинг строится на основе истории удалений строк кода.
                Каждое исправление чужого кода повышает рейтинг программиста и снижает рейтинг автора исправленного кода.
                Чтобы повысить свой рейтинг, программисту нужно писать код без дефектов и постоянно улучшать весь остальной код.
                Рейтинг показывает, насколько программист соблюдает Главный Закон Контроля Качества ПО
                (см. Стив Макконнелл, Совершенный код, второе издание, глава 20.5)
                и <a href="https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF_%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D1%81%D1%82%D0%B8/%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D1%81%D1%82%D0%B8">принцип открытости/закрытости</a>,
                в частности. <a href="https://github.com/victorx64/devrating#how-it-works">Узнать больше о том, как строится рейтинг...</a>
            </p>
            <br />
            <h2>
                Чем это лучше Code Churn?
            </h2>
            <p className="lead font-weight-normal">
                Так же, как и рейтинг, Code Churn строится на основе изменений строк кода. Это популярная и наиболее современная метрика в области измерения продуктивности программистов.
                Проблема Code Churn заключается в том, что его сложно интерпретировать. Он не дает однозначного ответа, что делать в том, или ином случае.
                Значение этой метрики зависит от большого числа факторов. В <a href="https://www.pluralsight.com/blog/teams/6-causes-of-code-churn-and-what-you-should-do-about-them">статье от Pluralsight</a> приводится
                шесть различных причин высокого Code Churn: неоднозначные требования, безучастный заказчик, сложная проблема, прототипирование, полировка и низкая вовлеченность программиста.
                Также, Code Churn меняется со временем в зависимости от зрелости проекта. Часто начинается с высокого значения и постепенно падает по мере стабилизации проекта.
            </p>
            <p className="lead font-weight-normal">
                Dev Rating понятен и имеет однозначное толкование. Рейтинг не зависит от продолжительности проекта и всегда показывает относительную эффективность программистов в момент времени.
            </p>
            <br />
            <h2>
                Как рейтинг повышает мотивацию?
            </h2>
            <p className="lead font-weight-normal">
                С рейтинговой системой программисты будут знать, что каждое улучшение кода будет замечено.
                Объективная оценка навыков позволит им быстрее проявить себя через результат работы.
                Поощряйте сильных программистов, чтобы создать у команды нацеленность на конечный результат.
            </p>
            <br />
            <LastWorks repository={encodeURIComponent('https://github.com/esphereal/aqua.git')} description=' – демо-репозиторий' title='Рейтинг обновляется после каждого Пулл-Реквеста' />
            <br />
            {/* <h2>
                Как вычисляется объем работ?
            </h2>
            <p className="lead font-weight-normal">
                Объем работы пропорционален рейтингу автора и количеству новых срок. Рейтинговая система, которая поощряет 
                стабильный код и постоянное улучшение кода, <a href="https://github.com/victorx64/devrating#how-is-this-better-than-the-lines-of-code-metric">устраняет известные недостатки</a> простого
                подсчета строк кода.
            </p>
            <br /> */}
            <h2>
                Как это помогает распределенным командам?
            </h2>
            <p className="lead font-weight-normal">
                Сервис делает более прозрачным отслеживание прогресса удаленных программистов.
                Чем быстрее и качественнее работает программист по сравнению с другими членами команды, тем выше будет его рейтинг.
            </p>
            <br />
            <p className="row justify-content-center" id="form">
                <iframe scrolling="no" title="contact-form" src="https://docs.google.com/forms/d/e/1FAIpQLSdxhJ2olChHV-o0UAdAKo9l0h6jsoF6oE0btSpvhwLbpWfpZw/viewform?embedded=true" width="640" height="1405" frameBorder="0" marginHeight="0" marginWidth="0">
                    Загрузка…
                </iframe>
            </p>
            <br />
        </>
    );
}