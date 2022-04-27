import FilterView from '../src/view/trip-filters-view';
import {render} from './render';
import ListPresenter from './presenter/list-presenter';

const siteMainElement = document.querySelector('.page-body');
const siteFiltersContainer = siteMainElement.querySelector('.trip-controls__filters');
const siteTripContainer = siteMainElement.querySelector('.trip-events');
const listPresenter = new ListPresenter();

render(new FilterView(), siteFiltersContainer);

listPresenter.init(siteTripContainer);
