import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Auth, DataStore } from 'aws-amplify';
import { Courier, TransportationModes } from '../../models';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const Profile = () => {
  // @ts-ignore
  const { subUser, setDbCourier, dbCourier } = useAuthContext();
  const navigation = useNavigation();

  const [name, setName] = useState(dbCourier?.name || '');
  const [transportationMode, setTransportationMode] = useState(TransportationModes.DRIVING);

  const createCourier = async () => {
    try {
      const courier = await DataStore.save(
        new Courier({
          name,
          lat: 0,
          lng: 0,
          sub: subUser,
          transportationMode: transportationMode,
        }),
      );
      setDbCourier(courier);
    } catch (error) {
      Alert.alert(error);
    }
  };

  const updateCourier = async () => {
    try {
      const courier = await DataStore.save(
        Courier.copyOf(dbCourier, updated => {
          updated.name = name;
          updated.transportationMode = transportationMode;
        }),
      );
      setDbCourier(courier);
    } catch (error) {
      Alert.alert(error);
    }
  };
  const onSave = async () => {
    if (dbCourier) {
      await updateCourier();
    } else {
      await createCourier();
    }
    navigation.goBack();
  };
  const onSignOut = () => {
    Auth.signOut();
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.BICYCLING ? 'lightgreen' : 'white',
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable
          onPress={() => setTransportationMode(TransportationModes.DRIVING)}
          style={{
            backgroundColor:
              transportationMode === TransportationModes.DRIVING ? 'lightgreen' : 'white',
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
          }}
        >
          <FontAwesome5 name="car" size={40} color="black" />
        </Pressable>
      </View>
      <Button onPress={onSave} title="Save" />
      <Button onPress={onSignOut} title="Sign out" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
