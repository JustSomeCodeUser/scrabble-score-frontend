import React from 'react';
import styles from './TopScores.module.css';

const ScoresTable = ({ topScores, toggleDetails }) => (
    <table className={styles.topScoresTable}>
        <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Total 10 Score</th>
            <th>Words</th>
        </tr>
        </thead>
        <tbody>
        {topScores.slice(0, 10).map((session, index) => (
            <React.Fragment key={index}>
                <tr className={styles.listItem}>
                    <td>{index + 1}</td>
                    <td>{session.playerName}</td>
                    <td>{session.totalScore}</td>
                    <td>
                        <button
                            className={styles.btnToggle}
                            onClick={() => toggleDetails(index)}
                        >
                            {session.showDetails ? 'Hide Words' : 'Show Words'}
                        </button>
                    </td>
                </tr>
                {session.showDetails && (
                    <tr>
                        <td colSpan={4}>
                            <ul className={styles.wordList}>
                                {session.scores.map((score, subIndex) => (
                                    <li key={subIndex}>
                                        {score.word}: {score.wordScore}
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        ))}
        </tbody>
    </table>
);

export default ScoresTable;
