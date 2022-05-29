import ListPresenter from './presenter/list-presenter';
import PointsModel from './model/points-model';

const siteMainElement = document.querySelector('.page-body');
const siteFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const siteTripMainContainer = siteMainElement.querySelector('.trip-main');
const siteTripContainer = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const listPresenter = new ListPresenter(siteTripContainer, siteTripMainContainer, siteFiltersContainer, pointsModel);

listPresenter.init();
