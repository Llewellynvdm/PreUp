/**
 * Class for managing local storage of data.
 */
export class Memory {
  // Constant representing one day in milliseconds.
  static ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

  /**
   * Stores data in local storage.
   *
   * @param {string} key - The data key.
   * @param {Object} data - The scripture data to be stored.
   * @throws {Error} If storing data fails.
   */
  static set(key, data) {
    const item = {
      data,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error storing data in local storage:', error);
      throw error;
    }
  }

  /**
   * Retrieves data from local storage.
   *
   * @param {string} key - The data key.
   * @returns {Promise<Object|null>} The scripture data or null if not found.
   */
  static async get(key) {
    try {
      const storedItem = localStorage.getItem(key);
      if (storedItem) {
        const {data, timestamp} = JSON.parse(storedItem);
        if (timestamp > Date.now() - Memory.ONE_DAY_IN_MILLISECONDS) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing or retrieving data from local storage:', error);
      throw error;
    }
  }
}
