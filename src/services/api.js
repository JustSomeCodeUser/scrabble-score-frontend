import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/scores';

/**
 * Handles API errors and returns error messages
 * @param {any} error - Error object
 * @returns {{message: string}}
 */
export const handleApiError = (error) => {
    if (error.response) {
        console.error('API Response Error:', error.response.data);
        return { message: error.response.data.message || 'Unknown API response error.' };
    } else if (error.request) {
        console.error('API Request Error:', error.request);
        return { message: "No response from server, check your network connection." };
    } else {
        console.error('API Setup Error:', error.message);
        return { message: "Error setting up request to API." };
    }
};

/**
 * Calculates the score for a word using the API
 * @param {string} word - Word to calculate score for
 * @returns {Promise<any>}
 * @throws {any}
 */
export const calculateScore = async (word) => {
    try {
        const response = await axios.post(`${BASE_URL}/calculate`, { word }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Submits the score session to the API
 * @param {object} session - Session data to submit
 * @returns {Promise<any>}
 * @throws {any}
 */
export const submitScores = async (session) => {
    try {
        const response = await axios.post(`${BASE_URL}/submit`, session, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Gets the top scores from the API
 * @returns {Promise<any>}
 * @throws {any}
 */
export const getTopScores = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/top`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};
