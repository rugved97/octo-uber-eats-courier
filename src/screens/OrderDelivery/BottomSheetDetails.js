// @ts-nocheck
import { View, Text, Pressable } from 'react-native';
import React, { useMemo, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';
import styles from './styles';
import { Order, OrderStatus } from '../../models';
import { useOrderContext } from '../../contexts/OrderContext';
import { useNavigation } from '@react-navigation/native';
const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: 'Accept Order',
  ACCEPTED: 'Pick-up Order',
  PICKED_UP: 'Complete Delivery',
};
const BottomSheetDetails = props => {
  const navigation = useNavigation();
  const { totalKilometers, totalMinutes, onOrderAccepted } = props;
  const isDriverClose = totalKilometers < 1;
  const snapPoints = useMemo(() => ['12%', '95%'], []);
  const bottomSheetRef = useRef(null);
  const { order, dishes, user, pickUpOrder, completeOrder, acceptOrder } = useOrderContext();

  const onButtonPressed = async () => {
    const { status } = order;
    if (status === OrderStatus.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onOrderAccepted();
    }

    if (status === OrderStatus.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      pickUpOrder();
    }

    if (status === OrderStatus.PICKED_UP) {
      console.warn('FINISHED');
      bottomSheetRef.current?.collapse();
      await completeOrder();
      navigation.goBack();
    }
  };

  const isButtonDisabled = () => {
    const { status } = order;
    if (status === OrderStatus.READY_FOR_PICKUP) {
      return false;
    }
    if ((status === OrderStatus.ACCEPTED || status === OrderStatus.PICKED_UP) && isDriverClose) {
      return false;
    }
    return true;
  };
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.handleIndicatorContainer}>
        <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(0)} min</Text>
        <FontAwesome5
          name="shopping-bag"
          color="#3FC060"
          size="30"
          style={{ marginHorizontal: 10 }}
        />
        <Text style={styles.routeDetailsText}>{totalKilometers.toFixed(2)} km</Text>
      </View>
      <View style={styles.deliveryDetailsContainer}>
        <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
        <View style={styles.addressContainer}>
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text style={styles.addressText}>{order.Restaurant.address}</Text>
        </View>
        <View style={styles.addressContainer}>
          <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
          <Text style={styles.addressText}>{user?.address}</Text>
        </View>
        <View style={styles.orderDetailsContainer}>
          {dishes?.map(dishItem => (
            <Text style={styles.orderItemText} key={dishItem.id}>
              {dishItem.Dish.name} x {dishItem.Dish.quantity}
            </Text>
          ))}
          <Text style={styles.orderItemText}>Onion Rings x1</Text>
        </View>
      </View>
      <Pressable
        style={{
          ...styles.buttonContainer,
          backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060',
        }}
        onPress={onButtonPressed}
        disabled={isButtonDisabled()}
      >
        <Text style={styles.buttonText}>{STATUS_TO_TITLE[order.status]}</Text>
      </Pressable>
    </BottomSheet>
  );
};

export default BottomSheetDetails;
