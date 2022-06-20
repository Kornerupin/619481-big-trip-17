import {getPoint} from '../mock/point';
import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class PointsModel extends Observable{
  #points = Array.from({length: 18}, getPoint);

  get points() {
    return this.#points;
  }

  updatePoint = (updatePoint, updateType = UpdateType.PATCH) => {
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

  createPoint = (newPoint, updateType = UpdateType.PATCH) => {
    this.#points = [
      ...this.#points,
      newPoint
    ];

    this._notify(updateType, newPoint);
  };

  deletePoint = (deletePoint, updateType = UpdateType.PATCH) => {
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
