import React, { useEffect, useState } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LocationObject, getCurrentPositionAsync, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';


export default function MapPage() {
  const [currentLocation, setCurrentLocation] = useState<LocationObject>(null as any)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      await startTrace()
    })();
  }, []);
  /*useEffect(() => {
      if (socket) {
          socket.emit('location actualization', { ...location.coords, ...{ id:USER_ID } });
      }
  }, [location]);*/
  function handlePositionUpdate(location: LocationObject) {

  }
  async function startTrace() {
    const _location = await getCurrentPositionAsync()
    watchPositionAsync({}, handlePositionUpdate)
    setCurrentLocation(_location)
    setLoading(false)
    console.log(_location)
  }
  if (loading) {
    return (<ActivityIndicator />)
  }
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0021
      }}>
        <Marker
          coordinate={{ latitude: currentLocation.coords.latitude, longitude:currentLocation.coords.longitude }}
          image={require('../assets/favicon.png')}
        />
        </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
