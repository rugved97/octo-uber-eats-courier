import { Auth, DataStore } from 'aws-amplify';
import { createContext, useContext, useEffect, useState } from 'react';
import { Courier, Order, OrderDish, OrderStatus, UberUser } from '../models';
import { useAuthContext } from './AuthContext';

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  // @ts-ignore
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [dishes, setDishes] = useState(null);
  useEffect(() => {
    if (!order) {
      return;
    }
    const subscription = DataStore.observe(Order, order.id).subscribe(({ opType, element }) => {
      if (opType === 'UPDATE') {
        fetchOrder(element.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [order?.id]);

  const acceptOrder = async () => {
    //Update order, change status, assign driver to order
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, updated => {
        updated.status = OrderStatus.ACCEPTED; //Update to accepted
        updated.Courier = dbCourier;
      }),
    );
    setOrder(updatedOrder);
  };
  const pickUpOrder = () => {
    //Update order, change status, assign driver to order
    DataStore.save(
      Order.copyOf(order, updated => {
        updated.status = OrderStatus.PICKED_UP; //Update to accepted
        updated.Courier = dbCourier;
      }),
    ).then(setOrder);
  };
  const completeOrder = async () => {
    //Update order, change status, assign driver to order
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, updated => {
        updated.status = OrderStatus.COMPLETED; //Update to accepted
        updated.Courier = dbCourier;
      }),
    );
    setOrder(updatedOrder);
  };

  const fetchOrder = async id => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await DataStore.query(Order, id);
    // @ts-ignore
    DataStore.query(UberUser, fetchedOrder.userID).then(setUser);

    DataStore.query(OrderDish, od => od.orderID('eq', fetchedOrder.id)).then(setDishes);
    setOrder(fetchedOrder);
  };
  return (
    <OrderContext.Provider
      value={{ completeOrder, pickUpOrder, acceptOrder, setOrder, dishes, fetchOrder, order, user }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
