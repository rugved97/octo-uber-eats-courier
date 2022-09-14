// @ts-nocheck
import { View, Text, useWindowDimensions, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';
import orders from '../../../assets/data/orders.json';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import OrdersScreen from '../OrdersScreen';
import { DataStore } from 'aws-amplify';
import { Order, OrderDish, OrderStatus, UberUser } from '../../models';
import { useOrderContext } from '../../contexts/OrderContext';

const OrderDelivery = () => {
  const navigation = useNavigation();
  const { fetchOrder, order, dishes, user, pickUpOrder, completeOrder } = useOrderContext();
  const bottomSheetRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const { acceptOrder } = useOrderContext();
  const [totalKilometers, setTotalKilometers] = useState(0);
  const [isDriverClose, setIsDriverClose] = useState(false);
  const mapRef = useRef(null);
  // const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP);
  const snapPoints = useMemo(() => ['12%', '95%'], []);
  const route = useRoute();
  const id = route.params?.id;

  // @ts-ignore
  useEffect(() => {
    if (!id) {
      return;
    }
    fetchOrder(id);
  }, [id]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('noooo');
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    const foreGroundSubsciption = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 100,
      },
      updatedLocation => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      },
    );

    return () => foreGroundSubsciption;
  }, []);

  const onButtonPressed = async () => {
    if (order?.status === OrderStatus.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      acceptOrder();
    }

    if (order?.status === OrderStatus.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      pickUpOrder();
    }

    if (order?.status === OrderStatus.PICKED_UP) {
      console.warn('FINISHED');
      bottomSheetRef.current?.collapse();
      await completeOrder();
      navigation.goBack();
    }
  };

  const renderButtonTitle = () => {
    if (order?.status === OrderStatus.READY_FOR_PICKUP) {
      return 'Accept Order';
    }
    if (order?.status === OrderStatus.ACCEPTED) {
      return 'Pick-up Order';
    }
    if (order?.status === OrderStatus.PICKED_UP) {
      return 'Complete Delivery';
    }
  };

  const isButtonDisabled = () => {
    if (order?.status === OrderStatus.READY_FOR_PICKUP) {
      return false;
    }

    if (order?.status === OrderStatus.ACCEPTED && isDriverClose) {
      return false;
    }

    if (order?.status === OrderStatus.PICKED_UP && isDriverClose) {
      return false;
    }
    return true;
  };

  const restaurantLocation = {
    latitude: order?.Restaurant?.lat,
    longitude: order?.Restaurant?.lng,
  };
  const deliveryLocation = { latitude: user?.lat, longitude: user?.lng };
  if (!order || !driverLocation || !user) {
    return <ActivityIndicator size={'large'} color="gray" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ height: height, width: width }}
        showsUserLocation
        ref={mapRef}
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          destination={
            order?.status === OrderStatus.ACCEPTED ? restaurantLocation : deliveryLocation
          }
          strokeWidth={10}
          waypoints={order?.status === OrderStatus.READY_FOR_PICKUP ? [restaurantLocation] : []}
          strokeColor="#3FC060"
          apikey={'AIzaSyBBgyBe8VWK6ichnrjiBV0SKCg673qS4Hs'}
          onReady={results => {
            setIsDriverClose(results.distance <= 0.1);
            setTotalMinutes(results.duration);
            setTotalKilometers(results.distance);
          }}
        />
        <Marker
          title={order.Restaurant.name}
          description={order.Restaurant.address}
          coordinate={{ latitude: order.Restaurant.lat, longitude: order.Restaurant.lng }}
        >
          <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 15 }}>
            <Entypo name="shop" size={24} color="white" />
          </View>
        </Marker>
        <Marker title={user?.name} description={user?.address} coordinate={deliveryLocation}>
          <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 15 }}>
            <MaterialIcons name="restaurant" size={24} color="white" />
          </View>
        </Marker>
      </MapView>
      {order?.status === OrderStatus.READY_FOR_PICKUP && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle"
          size={45}
          color="black"
          style={{ top: 40, left: 15, position: 'absolute' }}
        />
      )}
      <Ionicons
        onPress={() => navigation.goBack()}
        name="arrow-back-circle"
        size={45}
        color="black"
        style={{ top: 40, left: 15, position: 'absolute' }}
      />
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
          <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
};

export default OrderDelivery;
