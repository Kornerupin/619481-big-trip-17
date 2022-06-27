import PointsModel from './model/points-model';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FiltersModel from './model/filters-model';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic 2342ji3oj1l23j3i';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const siteMainElement = document.querySelector('.page-body');
const siteFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const siteTripMainContainer = siteMainElement.querySelector('.trip-main');
const siteTripContainer = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filtersModel = new FiltersModel();
const filterPresenter = new FilterPresenter(siteFiltersContainer, filtersModel, pointsModel);
const boardPresenter = new BoardPresenter(siteTripContainer, siteTripMainContainer, pointsModel, filtersModel);

pointsModel.init();
boardPresenter.init();
filterPresenter.init();
