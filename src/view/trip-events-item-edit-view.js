import {getFormatDayJs, parseDayJs} from '../utils';
import {BLANK_POINT, POINT_TYPES} from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import cloneDeep from 'clone-deep';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createOfferFromTemplate = (data, isChecked, isDisabled) => {
  const {id, title, price} = data;
  const checkedText = isChecked ? 'checked ' : '';
  const disabledText = isDisabled ? 'disabled ' : '';

  return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}" ${checkedText} ${disabledText}>
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
};

const createPictureFromTemplate = (data) => {
  const {src, description} = data;

  return `<img class="event__photo" src="${src}" alt="${description}">`;
};

const createEventTypeFromTemplate = (type, checkedType, isModeAdd, isDisabled) => {
  if (POINT_TYPES.indexOf(type) === -1) {
    return false;
  }

  const textChecked = type === checkedType ? ' checked' : '';
  const textDisabled = isDisabled ? ' disabled ' : '';

  return `
    <div class="event__type-item">
      <input
        id="event-type-${type}-${+isModeAdd}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${textChecked}
        ${textDisabled}
      >
      <label
        class="event__type-label  event__type-label--${type}"
        for="event-type-${type}-${+isModeAdd}">
          ${type}
      </label>
    </div>`;
};

const createItemEditTemplate = (point, isModeAdd, pointsModel) => {
  const {
    basePrice,
    destination,
    type,
    offers,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  let events = '';
  for (const current of POINT_TYPES) {
    events+= createEventTypeFromTemplate(current, type, isModeAdd, isDisabled);
  }

  const dateFrom = point?.dateFrom ? parseDayJs(point.dateFrom) : parseDayJs(new Date());
  const dateTo = point?.dateFrom ? parseDayJs(point.dateTo) : parseDayJs(new Date());

  let offersNodes = '';

  const currentTypeOffers = pointsModel.offers
    .find((offer) => offer.type === type)
    .offers;

  for (const current of currentTypeOffers) {
    offersNodes += createOfferFromTemplate(current, offers.includes(current.id), isDisabled);
  }
  if (!offersNodes) {
    offersNodes = 'No offers';
  }

  const cityName = destination.name;

  const destinationDescription = destination.description;
  const destinationPictures = destination.pictures.map(
    (current) => createPictureFromTemplate(current)
  ).join();
  const destinationList = pointsModel.destinations
    .map((current) => `<option value="${current.name}">${current.name}</option>`)
    .join('');

  let destinationBlock = '';
  if (destinationDescription.length > 1 || destinationPictures.length > 1) {
    destinationBlock = `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationDescription}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destinationPictures}
          </div>
        </div>
      </section>
    `;
  }

  const eventStartTime = getFormatDayJs(parseDayJs(dateFrom), 'DD/MM/YY HH:mm');
  const eventEndTime = getFormatDayJs(parseDayJs(dateTo), 'DD/MM/YY HH:mm');

  const addText = isModeAdd ? 1 : 0;

  const disabledText = isDisabled ? ' disabled ' : '';
  const saveText = isSaving ? 'Saving...' : 'Save';
  const deleteText = isDeleting ? 'Deleting...' : 'Delete';
  const modeText = isModeAdd
    ? 'Cansel'
    : deleteText;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${addText}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${addText}" type="checkbox" ${disabledText}>

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${cityName}" list="destination-list-1" ${disabledText}>
            <datalist id="destination-list-1">
              ${destinationList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                style="text-align: left;padding-left: 5px;box-sizing: border-box;" value="${eventStartTime}" ${disabledText}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                style="cursor: pointer" readonly value="${eventEndTime}" ${disabledText}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${disabledText}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${saveText}</button>
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

          ${destinationBlock}
        </section>
      </form>
    </li>
  `;
};

export default class TripEventsItemEditView extends AbstractStatefulView {
  #dateStartPicker = null;
  #dateStartPickerElement = null;
  #dateEndPicker = null;
  #dateEndPickerElement = null;
  #datePickerVirtualInput = null;
  #isModeAdd = false;

  #pointsModel = null;

  constructor(point = BLANK_POINT, pointsModel) {
    super();
    this._state = TripEventsItemEditView.parseItemToState(point);
    this.#isModeAdd = point === BLANK_POINT;
    this.#pointsModel = pointsModel;
    this._restoreHandlers();
  }

  get template() {
    return createItemEditTemplate(this._state, this.#isModeAdd, this.#pointsModel);
  }

  static parseItemToState = (item) => ({
    ...cloneDeep(item),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToTask = (state) => {
    const point = {
      ...cloneDeep(state)
    };

    delete point['isDisabled'];
    delete point['isSaving'];
    delete point['isDeleting'];

    return point;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setClickHandler(this._callback.click);
    this.setCanselHandler(this._callback.close);
    this.setDeleteHandler(this._callback.delete);
    this.#setDatepicker();
    this.#setDateByState();
  };

  reset = (task) => {
    this.updateElement(
      TripEventsItemEditView.parseItemToState(task)
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event--edit')
      .addEventListener('change', this.#innerFormHandler);
  };

  #innerFormHandler = (evt) => {
    const formData = new FormData(evt.currentTarget);
    const currentTypeOffers = this.#pointsModel.offers
      .find((offer) => offer.type === this._state.type)
      .offers;


    const eventType = formData.get('event-type');
    if (eventType !== this._state.type) {
      this.updateElement({
        type: eventType,
        offers: [],
      });
      return true;
    }

    for (const currentOffer of currentTypeOffers) {
      const isCurrentOfferChecked = !!formData.get(`event-offer-${currentOffer.id}`);
      let newOffers = null;
      // Если галочка поставлена, а в массиве "активных" пунктов этого пункта нет
      if (isCurrentOfferChecked && !this._state.offers.includes(currentOffer.id)) {
        newOffers = [...this._state.offers, currentOffer.id];
      }
      // Если галочки нет, а в массиве пункт указан как "активный"
      else if (!isCurrentOfferChecked && this._state.offers.includes(currentOffer.id)) {
        newOffers = this._state.offers.filter((currentId) => currentId !== currentOffer.id);
      }

      if (newOffers !== null) {
        this.updateElement({
          offers: newOffers,
        });
        return true;
      }
    }

    const eventDestination = formData.get('event-destination');
    if (eventDestination !== this._state.destination.name) {
      const newCity = this.#pointsModel.destinations.find((current) => current.name === eventDestination);

      if (newCity) {
        this.updateElement({
          destination: newCity,
        });
      }
      return true;
    }

    const eventPrice = parseInt(formData.get('event-price'), 10);
    if (eventPrice !== this._state.basePrice) {
      this.updateElement({
        basePrice: eventPrice,
      });
      return true;
    }
  };

  #setDatepicker = () => {
    this.#dateStartPickerElement = this.element.querySelector('#event-start-time-1');
    this.#dateEndPickerElement = this.element.querySelector('#event-end-time-1');
    // Виртуальный input, для красивого отображения даты окончания точки. Без него будет мигать =(
    this.#datePickerVirtualInput = document.createElement('input');

    const dateFrom = parseDayJs(this._state.dateFrom).$d;
    const dateTo = parseDayJs(this._state.dateTo).$d;

    this.#dateStartPicker = new flatpickr(
      this.#dateStartPickerElement,
      {
        mode: 'range',
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: [dateFrom, dateTo],
        onClose: this.#dateChangeHandler,
        ariaDateFormat: '',
        locale: {
          rangeSeparator: '      '
        },
        onChange: ([start, end]) => {
          if (start) {
            this.#dateStartPickerElement.value = getFormatDayJs(parseDayJs(start), 'DD/MM/YY HH:mm');
          }
          if (end) {
            this.#dateEndPickerElement.value = getFormatDayJs(parseDayJs(end), 'DD/MM/YY HH:mm');
          }
          else {
            this.#dateEndPickerElement.value = '--/--/-- --:--';
          }
        }
      }
    );
    this.#dateEndPicker = new flatpickr(
      this.#datePickerVirtualInput,
      {
        mode: 'range',
        enableTime: true,
        'time_24hr': true,
        dateFormat: '',
        defaultDate: [dateFrom, false],
        minDate: dateFrom,
        onClose: this.#dateChangeHandler,
        ariaDateFormat: '',
        locale: {
          rangeSeparator: '      '
        },
        onChange: ([start, end]) => {
          if (start) {
            this.#dateStartPickerElement.value = getFormatDayJs(parseDayJs(start), 'DD/MM/YY HH:mm');
          }
          if (end) {
            this.#dateEndPickerElement.value = getFormatDayJs(parseDayJs(end), 'DD/MM/YY HH:mm');
          }
        }
      }
    );

    this.#dateEndPickerElement.addEventListener('click', this.#openDateEndPicker);
  };

  #openDateEndPicker = () => {
    this.#dateEndPicker.open(false,this.#dateEndPickerElement);
  };

  #setDateByState = () => {
    const eventStartDateTimeElement = this.element.querySelector('#event-start-time-1');
    const eventEndDateTimeElement = this.element.querySelector('#event-end-time-1');
    const dateFrom = getFormatDayJs(parseDayJs(this._state.dateFrom), 'DD/MM/YY HH:mm');
    const dateTo = getFormatDayJs(parseDayJs(this._state.dateTo), 'DD/MM/YY HH:mm');

    eventStartDateTimeElement.value = dateFrom;
    eventEndDateTimeElement.value = dateTo;
  };

  #dateChangeHandler = ([start, end]) => {
    const startDate = getFormatDayJs(parseDayJs(start).add(-3, 'hour'));
    const endDate = getFormatDayJs(parseDayJs(end).add(-3, 'hour'));

    if (startDate !== this._state.dateFrom || endDate !== this._state.dateTo) {
      this.updateElement({
        dateFrom: startDate,
        dateTo: endDate,
      });
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#clickHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripEventsItemEditView.parseStateToTask(this._state));
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setDeleteHandler = (callback) => {
    if (this.#isModeAdd) {
      return false;
    }
    this._callback.delete = callback;

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();

    this._callback.delete();
  };

  setCanselHandler = (callback) => {
    if (!this.#isModeAdd) {
      return false;
    }
    this._callback.close = callback;

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeHandler);
  };

  #closeHandler = (evt) => {
    evt.preventDefault();

    this._callback.close();
  };

  removeElement() {
    super.removeElement();

    this.#datePickerVirtualInput = null;
    this.#dateStartPickerElement = null;
    this.#dateEndPickerElement = null;

    if (this.#dateStartPicker !== null) {
      this.#dateStartPicker.destroy();
      this.#dateStartPicker = null;
    }
    if (this.#dateEndPicker !== null) {
      this.#dateEndPicker.destroy();
      this.#dateEndPicker = null;
    }
  }
}
