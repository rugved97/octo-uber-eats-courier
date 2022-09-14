// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED"
};

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const { UberUser, Order, Restaurant, Dish, Basket, BasketDish, OrderDish, Courier } = initSchema(schema);

export {
  UberUser,
  Order,
  Restaurant,
  Dish,
  Basket,
  BasketDish,
  OrderDish,
  Courier,
  OrderStatus,
  TransportationModes
};