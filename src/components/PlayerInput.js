import React from 'react';
import styles from './ScrabbleBoard.module.css';

const PlayerInput = ({ playerName, onNameChange }) => (
    <div className={`${styles.card} ${styles.playerInput}`}>
        <div className={styles.cardHeader}>Player Information</div>
        <input
            id="player-name"
            type="text"
            className={styles.inputField}
            value={playerName}
            onChange={onNameChange}
            placeholder="Player Name"
        />
    </div>
);

export default PlayerInput;
