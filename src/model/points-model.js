import {getPoint} from '../mock/point';

export default class PointsModel {
  #points = Array.from({length: 8}, getPoint);

  get points() {
    return this.#points;
  }
}
