import {getFormatDayJs, getFormatTime} from '../utils';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';
import {BlankPoint} from '../const';

const createOfferItemFromTemplate = (title, price) => `
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
  `;

const createTemplate = (point) => {
  const {type, basePrice, isFavorite, offers, destination} = point;
  const dateFrom = dayjs(point.dateFrom);
  const dateTo = dayjs(point.dateTo);

  let bonusPrice = 0;
  let offerItems = '';

  for (const current of offers.data) {
    if (current.isChecked) {
      bonusPrice += current.price;
      offerItems += createOfferItemFromTemplate(current.title, current.price);
    }
  }

  const totalPrice = basePrice + bonusPrice;

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${getFormatDayJs(dateFrom, 'YYYY-MM-DD')}">${getFormatDayJs(dateFrom, 'MMM D')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination?.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${getFormatDayJs(dateFrom, 'HH:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${getFormatDayJs(dateTo, 'HH:mm')}</time>
          </p>
          <p class="event__duration">${getFormatTime(dateTo - dateFrom)}</p>
        </div>
        <p class="event__price" title="Base price: &euro; ${basePrice}">
          &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers" title="Offers Price: &euro; ${bonusPrice}">
          ${offerItems ? offerItems : '<li>-</li>'}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

export default class TripEventsItemView extends AbstractView {
  #point = null;

  constructor(point = BlankPoint) {
    super();
    this.#point = point;
  }

  get template() {
    return createTemplate(this.#point);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setToggleFavoriteHandler = (callback) => {
    this._callback.toggleFavorite = callback;

    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#toggleFavoriteHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #toggleFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.toggleFavorite();
  };
}
