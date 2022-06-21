import AbstractView from '../framework/view/abstract-view';
import {getFormatDayJs, parseDayJs} from '../utils';

const createInfoTemplate = (points) => {
  let temp = '';
  let cities =
    points
      .map((current) => current.destination.name)
      .map((current) => {
        if (temp !== current) {
          temp = current;
          return current;
        }
        return -1;
      })
      .filter((current) => current !== -1);

  if (cities.length > 3) {
    cities = `${cities[0]} — ... — ${cities[cities.length -1]}`;
  }
  else {
    cities = cities.join(' — ');
  }

  const dateStart = parseDayJs(points[0].dateFrom);
  const dateTo = parseDayJs(points[points.length - 1].dateTo);
  let dates = null;

  if (dateStart.$M === dateTo.$M) {
    dates = `${getFormatDayJs(dateStart, 'MMM D')}&nbsp;&mdash;&nbsp;${getFormatDayJs(dateTo, 'D')}`;
  }
  else {
    dates = `${getFormatDayJs(dateStart, 'MMM D')}&nbsp;&mdash;&nbsp;${getFormatDayJs(dateTo, 'MMM D')}`;
  }

  let totalPrice = 0;

  for (const current of points) {
    totalPrice += current.basePrice;

    for (const offer of current.offers.data) {
      if (offer.isChecked) {
        totalPrice += offer.price;
      }
    }
  }

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${cities}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createInfoTemplate(this.#points);
  }
}
