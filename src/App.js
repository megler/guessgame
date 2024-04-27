import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function GuessApp() {
    const [range, setRange] = useState(100);
    const [maxGuesses, setMaxGuesses] = useState(5);
    const [gamesWon, setGamesWon] = useState(0);
    const [totalGuesses, setTotalGuesses] = useState(0);

    const onSettingsChange = (settings) => {
        setRange(settings.range);
        setMaxGuesses(settings.maxGuesses);
    };

    const onGameWon = (guessCount) => {
        setGamesWon(gamesWon + 1);
        setTotalGuesses(totalGuesses + guessCount);
    };

    return (
        <Router>
            <div className="container">
                <nav>
                    <Link to="/">Home</Link>|
                    <Link to="/settings">Settings</Link>|
                    <Link to="/stats">Stats</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home range={range} maxGuesses={maxGuesses} onGameWon={onGameWon} />} />
                    <Route path="/settings" element={<Settings onSettingsChange={onSettingsChange} range={range} maxGuesses={maxGuesses} />} />
                    <Route path="/stats" element={<Stats gamesWon={gamesWon} averageGuesses={gamesWon > 0 ? Math.round(totalGuesses / gamesWon) : 0} />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home({ range, maxGuesses, onGameWon }) {
    const [guess, setGuess] = useState('');
    const [number, setNumber] = useState(Math.floor(Math.random() * range) + 1);
    const [guesses, setGuesses] = useState([]);
    const [status, setStatus] = useState('');
    const [gameActive, setGameActive] = useState(true);

    const handleGuess = () => {
        if (!gameActive) return;

        if (guesses.length < maxGuesses) {
            let currentStatus = '';
            if (parseInt(guess) === number) {
                currentStatus = 'Guessed correctly';
                onGameWon(guesses.length + 1);
                setGameActive(false);
            } else if (parseInt(guess) > number) {
                currentStatus = 'Too high';
            } else {
                currentStatus = 'Too low';
            }

            const newGuesses = [...guesses, guess];
            setGuesses(newGuesses);

            if (newGuesses.length >= maxGuesses && currentStatus !== 'Guessed correctly') {
                currentStatus = `Out of guesses - the number was ${number}`;
                setGameActive(false);
            }

            setStatus(currentStatus);
        }
    };

    const restartGame = () => {
        setNumber(Math.floor(Math.random() * range) + 1);
        setGuesses([]);
        setStatus('');
        setGuess('');
        setGameActive(true);
    };

    return (
        <div className="content">
            <h1>Guess the Number!</h1>
            <p>Guess a number between 1 and {range}</p>
            <input
                type="number"
                min="0"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                className="guess-input"
                disabled={!gameActive}
            />
            <button onClick={handleGuess} disabled={!gameActive}>Guess</button>
            <button onClick={restartGame} className="restart-button">
                Restart
            </button>
            <p>{status}</p>
            <p>Guesses Left: {maxGuesses - guesses.length}</p>
        </div>
    );
}

function Settings({ onSettingsChange, range: initialRange, maxGuesses: initialMaxGuesses }) {
    const [range, setRange] = useState(initialRange);
    const [maxGuesses, setMaxGuesses] = useState(initialMaxGuesses);
    const [saveConfirmation, setSaveConfirmation] = useState('');

    const handleSettingsUpdate = () => {
        onSettingsChange({ range, maxGuesses });
        setSaveConfirmation('Settings have been saved!');

        setTimeout(() => {
            setSaveConfirmation('');
        }, 3000);
    };

    return (
        <div className="content">
            <h1>Settings</h1>
            <div>
                <label>Number Range: 1 -
                    <input type="number" min="1" value={range} onChange={(e) => setRange(e.target.value)} />
                </label>
            </div>
            <div>
                <label>Max Guesses:
                    <input type="number" min="1" value={maxGuesses} onChange={(e) => setMaxGuesses(e.target.value)} />
                </label>
            </div>
            <button onClick={handleSettingsUpdate}>Save Settings</button>
            {saveConfirmation && <p className="save-confirm">{saveConfirmation}</p>}
        </div>
    );
}



function Stats({ gamesWon, averageGuesses }) {
    return (
        <div className="content">
            <h1>Player Stats</h1>
            <p>Games Won: {gamesWon}</p>
            <p>Average Number of Guesses: {averageGuesses}</p>
        </div>
    );
}

export default GuessApp;
