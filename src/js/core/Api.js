import {Memory} from './Memory.js';

/**
 * Class for handling API calls to fetch scripture data.
 */
export class Api {
  /**
   * Fetches data from the API, using local storage to cache responses.
   *
   * @param {string} apiEndpoint - The endpoint URL for the API.
   * @param {string} key - The data key.
   * @returns {Promise<Object>} A promise that resolves with the scripture data.
   * @throws {Error} If the API request fails.
   */
  async get(apiEndpoint, key) {
    try {
      const localStorageData = await Memory.get(key);
      if (localStorageData !== null) {
        return localStorageData;
      }

      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText || 'Failed to fetch data'}`);
      }

      const data = await response.json();
      await Memory.set(key, data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error(error.message || 'Error fetching data');
    }
  }
}
