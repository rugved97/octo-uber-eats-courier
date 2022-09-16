// @ts-nocheck
import { View, useWindowDimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Courier, OrderStatus } from '../../models';
import { useOrderContext } from '../../contexts/OrderContext';
import BottomSheetDetails from './BottomSheetDetails';
import CustomMarker from '../../components/CustomMarker';
import { DataStore } from 'aws-amplify';
import { useAuthContext } from '../../contexts/AuthContext';

const OrderDelivery = () => {
  const navigation = useNavigation();
  const { fetchOrder, order, dishes, user, pickUpOrder, completeOrder } = useOrderContext();

  const { width, height } = useWindowDimensions();
  // @ts-ignore
  const { dbCourier } = useAuthContext();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKilometers, setTotalKilometers] = useState(0);
  const mapRef = useRef(null);

  const route = useRoute();
  const id = route.params?.id;

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

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
        distanceInterval: 500,
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

  useEffect(() => {
    if (!driverLocation) {
      return;
    }
    console.log(driverLocation);
    DataStore.save(
      Courier.copyOf(dbCourier, updated => {
        updated.lat = driverLocation.latitude;
        updated.lng = driverLocation.longitude;
      }),
    );
  }, [driverLocation]);

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
            setTotalMinutes(results.duration);
            setTotalKilometers(results.distance);
          }}
        />
        <CustomMarker data={order.Restaurant} type="RESTAURANT" />
        <CustomMarker data={user} type="USER" />
        <Marker title={user?.name} description={user?.address} coordinate={deliveryLocation}>
          <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 15 }}></View>
        </Marker>
      </MapView>
      <BottomSheetDetails
        onOrderAccepted={zoomInOnDriver}
        totalKilometers={totalKilometers}
        totalMinutes={totalMinutes}
      />
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
    </View>
  );
};

export default OrderDelivery;
