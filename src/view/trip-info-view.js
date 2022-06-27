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

  for (const point of points) {
    totalPrice += point.basePrice + point.totalPrice;
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
  #pointsModel = null;

  constructor(points, pointsModel) {
    super();
    this.#points = points;
    this.#pointsModel = pointsModel;
  }

  get template() {
    return createInfoTemplate(this.#points, this.#pointsModel);
  }
}
