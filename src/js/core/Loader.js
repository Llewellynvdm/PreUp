import {Api} from './Api.js';
import {Action} from './Action.js';

/**
 * Loader class responsible for handling the loading of pre updated version details.
 * It initializes necessary components and loads data into a specified HTML element.
 */
export class Loader {
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
    if (process.env.DEBUG) {
      console.log(data);
    }
  }
}
