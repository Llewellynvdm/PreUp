/**
 * Class for managing actions based on element data attributes.
 */
export class Action {
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
