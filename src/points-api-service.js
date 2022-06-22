import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  updateTask = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parseResponse = await ApiService.parseResponse(response);

    return parseResponse;
  };

  #adaptToServer = (point) => {
    const adaptedPont = {
      ...point,
      'base_price': point['basePrice'],
      'date_from': point['dateFrom'],
      'date_to': point['dateTo'],
      'is_favorite': point['isFavorite'],
    };

    delete adaptedPont['basePrice'];
    delete adaptedPont['dateFrom'];
    delete adaptedPont['dateTo'];
    delete adaptedPont['isFavorite'];

    return adaptedPont;
  };
}
