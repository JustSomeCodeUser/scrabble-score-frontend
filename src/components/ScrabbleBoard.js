import React, { useEffect, useState } from 'react';
import { submitScores } from '../services/api';
import WordList from './WordList';
import TopScores from './TopScores';
import { calculateScore, getScoreColor, letterScores } from '../utils/ScrabbleCalculator';
import styles from './ScrabbleBoard.module.css';
import PlayerInput from "./PlayerInput";

function ScrabbleBoard() {
    const [playerName, setPlayerName] = useState('');
    const [currentWord, setCurrentWord] = useState('');
    const [currentScore, setCurrentScore] = useState(0);
    const [words, setWords] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [uiError, setUiError] = useState('');
    const [apiError, setApiError] = useState('');
    const [tiles, setTiles] = useState(Array(10).fill(''));
    const [showTopScores, setShowTopScores] = useState(false);
    const [showAppendix, setShowAppendix] = useState(false);

    const isAlphabet = (value) => value === '' || /^[A-Za-z]$/.test(value);

    const handleTileChange = (index, value) => {
        if (isAlphabet(value)) {
            const newTiles = [...tiles];
            newTiles[index] = value.toUpperCase().slice(0, 1); // Limit to one uppercase letter
            setTiles(newTiles);
            setCurrentWord(newTiles.join('').trim());
        }
    };

    const handleTileFocus = (index) => {
        const tileElement = document.getElementById(`tile-${index}`);
        if (tileElement) {
            tileElement.focus();
        }
    };

    const handleInput = (index, e) => {
        const value = e.target.value.toUpperCase();
        if (isAlphabet(value)) {
            handleTileChange(index, value);
            if (value.length && index < tiles.length - 1) { // check if there is a value and not the last tile
                handleTileFocus(index + 1);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        const key = e.key;
        if (key === 'Backspace') {
            if (tiles[index] !== '') {
                handleTileChange(index, ''); // Clear the current tile
            } else if (index > 0) {
                handleTileFocus(index - 1); // Move focus backward
            }
        }
    };

    useEffect(() => {
        const updateScore = () => {
            if (currentWord) {
                setCurrentScore(calculateScore(currentWord));
            } else {
                setCurrentScore(0);
            }
        };
        updateScore();
    }, [currentWord]);

    const handleNameChange = (event) => {
        setPlayerName(event.target.value);
    };

    const handleAddWord = () => {
        if (!currentWord.trim()) {
            setUiError('Please enter a word.');
            return;
        }

        const newWord = { word: currentWord, score: currentScore };
        setWords([...words, newWord]);
        setTotalScore(totalScore + currentScore);
        setTiles(Array(10).fill(''));
        setCurrentWord('');
        setCurrentScore(0);
        setUiError('');
    };

    const handleRemoveWord = (index) => {
        const updatedWords = [...words];
        const removedWord = updatedWords.splice(index, 1)[0];
        setTotalScore(totalScore - removedWord.score);
        setWords(updatedWords);
    };

    const handleResetTiles = () => {
        setTiles(Array(10).fill(''));
        setCurrentWord('');
        setCurrentScore(0);
    };

    const handleSubmitSession = async () => {
        if (!playerName.trim()) {
            setUiError('Please enter a player name.');
            return;
        }

        const wordScorePairs = words.map(word => ({ word: word.word, score: word.score }));

        try {
            await submitScores({ playerName, scores: wordScorePairs });
            setWords([]);
            setTotalScore(0);
            setPlayerName('');
            setUiError('');
            setApiError('');
        } catch (error) {
            setApiError(error.message);
        }
    };

    const handleResetSession = () => {
        setWords([]);
        setTotalScore(0);
        setPlayerName('');
        setUiError('');
        setApiError('');
        handleResetTiles();
    };

    const toggleAppendix = () => setShowAppendix(!showAppendix);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Calculate Your Score</h1>
            </header>
            <PlayerInput playerName={playerName} onNameChange={handleNameChange} />
            <div className={`${styles.card}`}>
                <div className={styles.cardHeader}>Tiles</div>
                <div className={styles.tileContainer}>
                    {tiles.map((letter, index) => {
                        const score = letterScores[letter] || 0;
                        return (
                            <div key={index} className={styles.tileWrapper}>
                                {letter && (
                                    <div
                                        className={styles.scoreBadge}
                                        style={{ backgroundColor: getScoreColor(score) }}
                                    >
                                        {score}
                                    </div>
                                )}
                                <input
                                    id={`tile-${index}`}
                                    type="text"
                                    className={styles.tile}
                                    value={letter}
                                    maxLength={1}
                                    onChange={(e) => handleTileChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onInput={(e) => handleInput(index, e)}
                                />
                            </div>
                        );
                    })}
                </div>
                <p>Current Word: {currentWord} (Score: {currentScore})</p>

                <button className={styles.btnResetTiles} onClick={handleResetTiles}>
                    <span>Reset Tiles</span>
                </button>
                <button className={styles.btnAddWord} onClick={handleAddWord}>
                    <span>Add Word</span>
                </button>
            </div>
            <h1>TOTAL SCORE: {totalScore}</h1>
            <div className={`${styles.card}`}>
                <div className={styles.cardHeader}>Words and Scores</div>
                <WordList words={words} totalScore={totalScore} onRemoveWord={handleRemoveWord} />
                <button className={styles.btnSubmitSession} onClick={handleSubmitSession}>
                    Submit Session
                </button>
                <button className={styles.btnResetSession} onClick={handleResetSession}>
                    Reset Session
                </button>
                {uiError && <div className="alert alert-danger">{uiError}</div>}
                {apiError && <div className="alert alert-warning">{apiError}</div>}
            </div>
            <button className={styles.btnLeaderboard} onClick={() => setShowTopScores(true)}>
                View Top10 Leaderboard
            </button>
            <button className={styles.appendixButton} onClick={toggleAppendix}>
                Show Appendix
            </button>
            {showTopScores && <TopScores onClose={() => setShowTopScores(false)} />}
            {showAppendix && (
                <div className={styles.appendixModal}>
                    <div className={styles.appendixModalContent}>
                        <div className={styles.appendixModalHeader}>
                            <h2>Letter Scoring Rules</h2>
                            <span className={styles.closeAppendix} onClick={toggleAppendix}>&times;</span>
                        </div>
                        <table className={styles.appendixTable}>
                            <thead>
                            <tr>
                                <th>Letter</th>
                                <th>Score</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(letterScores).map(([letter, score]) => (
                                <tr key={letter} style={{ backgroundColor: getScoreColor(score) }}>
                                    <td>{letter}</td>
                                    <td>{score}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScrabbleBoard;
