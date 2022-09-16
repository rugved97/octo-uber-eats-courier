import { View, Text } from 'react-native';
import React from 'react';
import { Marker } from 'react-native-maps';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';

const CustomMarker = ({ data, type }) => {
  return (
    <Marker
      title={data.title}
      description={data.description}
      coordinate={{ latitude: data.lat, longitude: data.lng }}
    >
      <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 15 }}>
        {type === 'RESTAURANT' ? (
          <Entypo name="shop" size={24} color="white" />
        ) : (
          <MaterialIcons name="restaurant" size={24} color="white" />
        )}
      </View>
    </Marker>
  );
};

export default CustomMarker;
