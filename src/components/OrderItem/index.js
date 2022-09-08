import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const OrderItem = ({ order }) => {
  const navigation = useNavigation();
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
        source={{ uri: order.Restaurant.image }}
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
        <Text style={{ color: 'grey' }}>{order.User.name}</Text>
        <Text style={{ color: 'grey' }}>{order.User.address}</Text>
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
