import React from 'react';
import styles from './WordList.module.css';

const WordList = React.memo(({ words, onRemoveWord }) => {
    return (
        <ul className={styles.listGroup}>
            {words.map((word, index) => (
                <li className={styles.listItem} key={index}>
                    {index + 1}. {word.word} -> {word.score}
                    <button className={styles.btnRemove} onClick={() => onRemoveWord(index)}>
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
});

export default WordList;