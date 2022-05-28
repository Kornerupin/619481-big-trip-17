import FilterView from '../src/view/trip-filters-view';
import {render} from './render';
import ListPresenter from './presenter/list-presenter';
import PointsModel from './model/points-model';

const siteMainElement = document.querySelector('.page-body');
const siteFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const siteTripContainer = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const listPresenter = new ListPresenter(siteTripContainer, pointsModel);

render(new FilterView(), siteFiltersContainer);

listPresenter.init();
