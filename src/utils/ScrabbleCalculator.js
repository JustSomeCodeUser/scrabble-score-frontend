export const letterScores = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
    'J': 8, 'K': 6, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
    'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
};

export const calculateScore = (word) => {
    return word
        .toUpperCase()
        .split('')
        .reduce((total, letter) => total + (letterScores[letter] || 0), 0);
};

export const getScoreColor = (score) => {
    const baseColor = [245, 222, 179]; // Base beige color
    const factor = score / 15;
    const darkenedColor = baseColor.map((c) => Math.round(c * (1 - factor)));
    return `rgb(${darkenedColor.join(',')})`;
}