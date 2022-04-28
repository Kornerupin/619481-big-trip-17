import {render} from '../render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';


export default class ListPresenter {
  sortComponent = new TripSortView();
  listComponent = new TripEventsListView();
  itemEditComponent = new TripEventsItemEditView();
  itemsList = [];

  init = (tripContainer) => {
    this.tripContainer = tripContainer;

    render(this.sortComponent, this.tripContainer);
    render(this.listComponent, this.tripContainer);

    render(this.itemEditComponent, this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      const item = new TripEventsItemView();
      this.itemsList.push(item.getElement());

      render(item, this.listComponent.getElement());
    }
  };
}
