import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import OrderItem from '../../components/OrderItem';
import MapView from 'react-native-maps';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import { DataStore } from 'aws-amplify';
import { Courier, Order, OrderStatus } from '../../models';
import CustomMarker from '../../components/CustomMarker';
import { useAuthContext } from '../../contexts/AuthContext';
const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const bottomSheetRef = useRef(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ['12%', '95%'], []);

  const fetchOrders = () => {
    DataStore.query(Order, order => order.status('eq', OrderStatus.READY_FOR_PICKUP)).then(
      setOrders,
    );
  };

  useEffect(() => {
    fetchOrders();
    const subscription = DataStore.observe(Order).subscribe(msg => {
      if (msg.opType === 'UPDATE') {
        fetchOrders();
      }

      return () => subscription.unsubscribe();
    });
  }, []);

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
  }, []);

  if (!driverLocation) {
    return <ActivityIndicator size={'large'} color="gray" />;
  }

  return (
    <View style={{ backgroundColor: 'lightblue', flex: 1 }}>
      <MapView
        style={{ height: height, width: width }}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map(order => (
          <CustomMarker data={order.Restaurant} type="RESTAURANT" key={order?.id} />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5 }}>
            You're Online
          </Text>
          <Text style={{ letterSpacing: 0.5, color: 'grey' }}>
            Available Orders {orders.length}
          </Text>
        </View>
        <BottomSheetFlatList data={orders} renderItem={({ item }) => <OrderItem order={item} />} />
      </BottomSheet>
    </View>
  );
};

export default OrdersScreen;
