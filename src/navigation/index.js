import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/OrdersScreen';
import OrdersDeliveryScreen from '../screens/OrderDelivery';
import Profile from '../screens/ProfileScreen';
import { useAuthContext } from '../contexts/AuthContext';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  // @ts-ignore
  const { dbCourier } = useAuthContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          <Stack.Screen name="OrdersDeliveryScreen" component={OrdersDeliveryScreen} />
        </>
      ) : (
        <Stack.Screen name="ProfileScreen" component={Profile} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
