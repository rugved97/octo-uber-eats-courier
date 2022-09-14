import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { UberUser } from '../../models';
import { useEffect, useState } from 'react';
const DEFAULT_IMAGE =
  'https://image.shutterstock.com/image-photo/restaurant-chilling-out-classy-lifestyle-260nw-507639565.jpg';
const OrderItem = ({ order }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    DataStore.query(UberUser, order.userID).then(setUser);
  }, []);

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        borderColor: '#3FC060',
        margin: 10,
        borderWidth: 2,
        borderRadius: 12,
      }}
      // @ts-ignore
      onPress={() => navigation.navigate('OrdersDeliveryScreen', { id: order.id })}
    >
      <Image
        source={{
          uri: order.Restaurant.image.startsWith('http') ? order.Restaurant.image : DEFAULT_IMAGE,
        }}
        style={{
          height: '100%',
          width: '25%',
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
        }}
      />
      <View style={{ marginLeft: 10, flex: 1, paddingVertical: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>{order.Restaurant.name}</Text>
        <Text style={{ color: 'grey' }}>{order.Restaurant.address}</Text>

        <Text style={{ marginTop: 10 }}>Delivery Details</Text>
        <Text style={{ color: 'grey' }}>{user?.name}</Text>
        <Text style={{ color: 'grey' }}>{user?.address}</Text>
      </View>
      <View
        style={{
          backgroundColor: '#3FC060',
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
        }}
      >
        <Entypo name="check" color={'white'} size={30} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderItem;
