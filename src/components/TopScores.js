import React, { useState, useEffect } from 'react';
import { getTopScores, handleApiError } from '../services/api';
import styles from './TopScores.module.css';
import ScoresTable from "./ScoresTable";

const TopScores = ({ onClose }) => {
    const [topScores, setTopScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const toggleDetails = (index) => {
        setTopScores((prevScores) =>
            prevScores.map((score, i) => {
                if (i === index) {
                    return { ...score, showDetails: !score.showDetails };
                }
                return score;
            })
        );
    };

    useEffect(() => {
        const fetchTopScores = async () => {
            try {
                const scores = await getTopScores();
                setTopScores(scores.map(score => ({ ...score, showDetails: false })));
            } catch (err) {
                setError(handleApiError(err).message);
            } finally {
                setLoading(false);
            }
        };
        fetchTopScores();
    }, []);

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>Top Scores</h2>
                {loading ? <p>Loading...</p> :
                    (topScores.length > 0 ? (
                        <div className={styles.card}>
                            <ScoresTable topScores={topScores} toggleDetails={toggleDetails} />
                        </div>
                    ) : (
                        <p>No scores available</p>
                    ))
                }
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
    );
};

export default TopScores;
