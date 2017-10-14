import { ItemController } from '../controllers/itemController';
import { Route } from '../protocols/http';

const secureAPI = false;

// Production routes for development purposes only
export const routes: Route[] =
[

  new Route('Get all items', '/items', 'GET', secureAPI, ItemController.getAllItems),
  new Route('Get spicific item', '/items/:id', 'GET', secureAPI, ItemController.getSpecificItem),
  new Route('Create item', '/items', 'POST', secureAPI, ItemController.createItem),
  new Route('Delete item', '/items/:id/delete', 'POST', secureAPI, ItemController.deleteItem),
  new Route('Book item', '/items/:id/book', 'POST', secureAPI, ItemController.bookItem),
  new Route('Book item', '/items/:id/book', 'POST', secureAPI, ItemController.bookItem),
  new Route('Get booked items', '/items/:userID/bookedItems', 'GET', secureAPI, ItemController.getBookedItems),  
];

// Routes for development purposes only
export const devRoutes: Route[] =
[
  // new Route("Print sites", "/dev/projects/print", "GET", false, DevController.printSites),
];
