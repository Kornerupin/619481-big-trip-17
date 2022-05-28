import {createElement} from '../render';
import {getFormatDayJs, parseDayJs} from '../utils';
import {POINT_TYPES} from '../const';

const createOfferFromTemplate = (data, id) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${data.isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-luggage-${id}">
      <span class="event__offer-title">${data.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${data.price}</span>
    </label>
  </div>
`;

const createEventTypeFromTemplate = (type, checkedType, isModeAdd) => {
  if (POINT_TYPES.indexOf(type) === -1) {
    return false;
  }

  const textChecked = type === checkedType ? 'checked' : '';
  const textAdd = isModeAdd ? 1 : 0;

  return `
    <div class="event__type-item">
      <input
        id="event-type-${type}-${textAdd}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${textChecked}
      >
      <label
        class="event__type-label  event__type-label--${type}"
        for="event-type-${type}-${textAdd}">
          ${type}
      </label>
    </div>`;
};

const createTemplate = (point = {}) => {
  const isModeAdd = !Object.values(point).length;

  // Значения по умолчанию
  const {
    basePrice = 0,
    destination = {
      'description': '',
      'name': '',
      'pictures': [
        {
          'src': '',
          'description': ''
        }
      ]
    },
    type = 'taxi',
    offers = {
      type: 'taxi',
      data: []
    },
  } = point;

  let events = '';
  for (const current of POINT_TYPES) {
    events+= createEventTypeFromTemplate(current, type, isModeAdd);
  }

  const dateFrom = point?.dateFrom ? parseDayJs(point.dateFrom) : parseDayJs(new Date());
  const dateTo = point?.dateFrom ? parseDayJs(point.dateTo) : parseDayJs(new Date());

  let offersNodes = '';
  for (const current of offers.data) {
    offersNodes += createOfferFromTemplate(current, Math.random() * 100000);
  }
  if (!offersNodes) {
    offersNodes = 'No offers';
  }

  const cityName = destination.name;

  const cityDescription = destination.description;

  const eventStartTime = getFormatDayJs(parseDayJs(dateFrom), 'DD/MM/YY HH:mm');
  const eventEndTime = getFormatDayJs(parseDayJs(dateTo), 'DD/MM/YY HH:mm');

  const modeText = isModeAdd
    ? 'Cansel'
    : 'Delete';
  const addText = isModeAdd ? 1 : 0;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${addText}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${addText}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${events}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${cityName}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${modeText}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersNodes}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${cityDescription}</p>
          </section>
        </section>
      </form>
    </li>
  `;
};

export default class TripEventsItemEditView {
  #element = null;
  #point = null;

  constructor(point) {
    this.#point = point;
  }

  get template() {
    return createTemplate(this.#point);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
    this.#point = null;
  }
}
