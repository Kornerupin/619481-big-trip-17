import AbstractView from '../framework/view/abstract-view';

const createInfoTemplate = (isDisabled) => {
  const textDisabled = isDisabled ? ' disabled' : '';

  return `
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${textDisabled}>
      New event
    </button>
  `;
};

export default class TripNewPointButtonView extends AbstractView {
  #isDisabled = false;

  constructor(isDisabled) {
    super();

    this.#isDisabled = isDisabled;
  }

  get template() {
    return createInfoTemplate(this.#isDisabled);
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
