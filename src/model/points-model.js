import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class PointsModel extends Observable{
  #points = [];
  #destinations = [];
  #offers = [];
  #pointsApiService = null;

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  #adaptToClient = (point) => {
    const adaptedPont = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPont['base_price'];
    delete adaptedPont['date_from'];
    delete adaptedPont['date_to'];
    delete adaptedPont['is_favorite'];

    return adaptedPont;
  };

  init = async () => {
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = (updateType, updatePoint) => {
    const index = this.points.findIndex((item) => item.id === updatePoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point!');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatePoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, updatePoint);
  };

  createPoint = (updateType, newPoint) => {
    this.#points = [
      ...this.#points,
      newPoint
    ];

    this._notify(updateType, newPoint);
  };

  deletePoint = (updateType, deletePoint) => {
    const index = this.#points.findIndex((current) => current.id === deletePoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point!');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, deletePoint);
  };
}
