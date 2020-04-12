import React from 'react';
import Leaderboard from "./Leaderboard.js";
import './App.css';

export default function Home() {
    return (
        <>
            <h1 className="mt-5">
                Рейтинг эффективности программистов
            </h1>
            <p className="lead font-weight-normal">
                Получи рейтинг программистов по стабильности их кода.
                Чем стабильнее код, тем меньше исправлений было сделано после первого написания кода.
                Каждое исправление это затраты времени на нахождение бага, устранение бага и тестирование.
            </p>
            <p className="row justify-content-center">
                <a className="btn btn-primary" href="https://github.com/marketplace/dev-rating">Установить GitHub App</a>
            </p>
            <p className="lead font-weight-normal">
                Рейтинг отображает, кто из программистов эффективно расходует время.
                Используйте данный сервис для мотивации программистов сокращать время разработки ПО.
            </p>

            <br />
            <Leaderboard repository={encodeURIComponent('https://github.com/esphereal/aqua.git')} description=' – демо-репозиторий' title='Пример' />

            <p className="lead font-weight-normal">
                Рейтинг строится на основе истории удалений строк кода.
                Каждое исправление чужого кода повышает рейтинг программиста и снижает рейтинг автора исправленного кода.
                Рейтинг показывает, насколько автор соблюдает Главный Закон Контроля Качества ПО
                (см. Стив Макконнелл, Совершенный код, второе издание, глава 20.5)
                и <a href="https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF_%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D1%81%D1%82%D0%B8/%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D1%81%D1%82%D0%B8">принцип открытости/закрытости</a>,
                в частности. <a href="https://github.com/victorx64/devrating#how-it-works">Узнать больше...</a>
            </p>
        </>
    );
}