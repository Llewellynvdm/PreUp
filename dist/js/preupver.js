/**
 * PreUpVer v1.0.0
 * https://git.vdm.dev/Llewellyn/PreUpVer
 * (c) 2014 - 2023 Llewellyn van der Merwe
 * MIT License
 **/

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /**
   * Class for managing local storage of data.
   */
  class Memory {
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

  /**
   * Class for handling API calls to fetch scripture data.
   */
  class Api {
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

  /**
   * Class for managing actions based on element data attributes.
   */
  class Action {
    #element;
    #apiURL;
    #description;
    #libUrl;
    #id;

    /**
     * Initializes the Actions object with a DOM element and its data attributes.
     *
     * @param {HTMLElement} element - The DOM element containing data attributes.
     */
    constructor(element) {

      if (!(element instanceof HTMLElement)) {
        throw new Error("triggerElement must be an instance of HTMLElement.");
      }

      this.#element = element;
      this.#id = element.id;
      this.#apiURL = element.dataset.apiUrl;
      this.#description = element.dataset.description;
      this.#libUrl = element.dataset.url;
    }

    /**
     * Retrieves the id/key.
     *
     * @returns {string} The element key.
     */
    get id() {
      return this.#id;
    }

    /**
     * Retrieves the api URL.
     *
     * @returns {string} The library API url to get the version data.
     */
    get api() {
      return this.#apiURL;
    }

    /**
     * Retrieves the library description.
     *
     * @returns {string} The library description.
     */
    get description() {
      return this.#description;
    }

    /**
     * Retrieves the Library URL.
     *
     * @returns {string} The library url to include.
     */
    get libUrl() {
      return this.#libUrl;
    }

    /**
     * Retrieves the DOM element.
     *
     * @returns {HTMLElement} The DOM element associated with this object.
     */
    get element() {
      return this.#element;
    }
  }

  /**
   * Loader class responsible for handling the loading of pre updated version details.
   * It initializes necessary components and loads data into a specified HTML element.
   */
  class Loader {
    #api;
    #action;

    /**
     * Constructs a Loader instance.
     * Allows for dependency injection of the Api class for easier testing and flexibility.
     * @param {Api} api - Instance of Api class for making API calls.
     */
    constructor(api = new Api()) {
      this.#api = api;
    }

    /**
     * Load the Reference references into the specified HTML element.
     *
     * @param {HTMLElement} element - The element to update.
     */
    async load(element) {
      if (!this.#validate(element)) {
        return;
      }
      this.#init(element);
      await this.#process();
    }

    /**
     * Validates the element
     * @param {HTMLElement} element - The element to update.
     * @returns {boolean} true if valid
     * @private
     */
    #validate(element) {
      if (!element.id) {
        console.error("Element missing ID:", element);
        return false;
      }
      return true;
    }

    /**
     * Processes a valid pre tag by fetching the new version and loading it.
     * This method handles the asynchronous nature of API calls.
     * @private
     */
    async #process() {
      try {
        const data = await this.#api.get(this.#action.api, this.#action.id);
        if (data) {
          this.#load(data);
        }
      } catch (error) {
        console.error(`Error loading preupver:`, error);
      }
    }

    /**
     * Initializes components necessary.
     *
     * @param {HTMLElement} element - The element to be initialized for loading.
     * @private
     */
    #init(element) {
      this.#action = new Action(element);
    }

    /**
     * Load the data to the pre tag.
     *
     * @param {object} data - The version data.
     * @private
     */
    #load(data) {
      const version = data[0].name;
      const preTag = document.getElementById(this.#action.id);
      if (!preTag) {
        throw new Error('Pre tag not found.');
      }
      preTag.innerHTML = `&lt;!-- ${this.#action.description} --&gt;\n&lt;script src&#x3D;&quot;${this.#action.libUrl.replace('${version}', version)}&quot;&gt;&lt;/script&gt;`;
      {
        console.log(data);
      }
    }
  }

  /**
   * Initializes loaders for elements with class 'preupver'.
   * Each element gets its own Loader instance because each loader maintains state
   * specific to the element it operates on. This function encapsulates the logic
   * for finding relevant elements and initializing loaders for them.
   * @param {Api} api - The Api instance to be used by each Loader.
   */
  function initializePreUpVerLoaders(api) {
    const elements = document.querySelectorAll('.preupver');
    elements.forEach(element => {
      // Create a new loader instance for each element
      const loader = new Loader(api);
      loader.load(element).catch(error => {
        // Error handling for each loader instance
        console.error(`Loading error for element ${element}:`, error);
      });
    });
  }

  /**
   * Entry point to load pre tag version updater.
   * Attaches event listener to DOMContentLoaded to ensure the DOM is fully loaded
   * before attempting to initialize loaders.
   */
  document.addEventListener('DOMContentLoaded', (event) => {
    try {
      const api = new Api();
      initializePreUpVerLoaders(api);
    } catch (error) {
      console.error("Error initializing PreUp loaders:", error);
    }
  });

}));
