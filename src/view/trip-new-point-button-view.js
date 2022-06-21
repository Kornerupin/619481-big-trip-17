import AbstractView from '../framework/view/abstract-view';

const createInfoTemplate = () => `
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
      New event
    </button>
  `;

export default class TripNewPointButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createInfoTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.element.disabled = true;
    this._callback.click();
  };
}
