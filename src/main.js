import PointsModel from './model/points-model';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FiltersModel from './model/filters-model';

const siteMainElement = document.querySelector('.page-body');
const siteFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const siteTripMainContainer = siteMainElement.querySelector('.trip-main');
const siteTripContainer = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();
const boardPresenter = new BoardPresenter(siteTripContainer, siteTripMainContainer, pointsModel, filtersModel);
const filterPresenter = new FilterPresenter(siteFiltersContainer, filtersModel, pointsModel);

filterPresenter.init();
boardPresenter.init();
