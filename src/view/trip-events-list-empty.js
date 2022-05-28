import {createElement} from '../render';

export default class TripEventsListEmpty {
  #element = null;

  get template() {
    return `
      <p class="trip-events__msg">Click New Event to create your first point</p>
    `;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
