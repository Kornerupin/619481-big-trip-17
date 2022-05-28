import {createElement} from '../render';

export default class TripEventsListView {
  #element = null;

  get template() {
    return `
      <ul class="trip-events__list">
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
