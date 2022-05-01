import {getPoint} from '../mock/point';

export default class PointsModel {
  points = Array.from({length: 17}, getPoint);

  getPoints = () => this.points;
}
