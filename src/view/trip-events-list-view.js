import {createElement} from '../render';

export default class TripEventsListView {
  getTemplate() {
    return `
      <ul class="trip-events__list">
    `;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
