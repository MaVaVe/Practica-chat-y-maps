import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Accuracy, LocationObject, LocationOptions, getCurrentPositionAsync, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import { Socket, io } from 'socket.io-client';
import * as Crypto from 'expo-crypto';

const userId = Crypto.randomUUID()
export default function MapPage() {
  const [currentLocation, setCurrentLocation] = useState<LocationObject>(null as any)
  const [location, setLocation] = useState<LocationObject>(null as any)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<Socket<any>>(undefined as any);
  const [locations, setLocations] = useState<LocationObject[]>([])
  // Replace with your server address

  useEffect(() => {
    const _socket = io('http://172.20.10.4:3000');
    setSocket(_socket)
  }, []);

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

  useEffect(() => {
    if(socket){
        socket.on('location', (location:LocationObject):void => {
          
            setLocations((prevlocations) => {
              const filteredLocations = prevlocations.filter(_location=>_location.id!==location.id)
              return[...filteredLocations, location]});
        })
    }
}, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit('location', { ...location,...{["id"]:userId}});
    }
  }, [location]);
  function handlePositionUpdate(_location: LocationObject) {
    setLocation(_location)
  }
  async function startTrace() {
    const _location = await getCurrentPositionAsync()
    const options:LocationOptions = {accuracy:Accuracy.Highest,distanceInterval:1}
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
        {
          locations.map(_location=>
          <Marker
            key={_location.id}
            coordinate={{ latitude: _location.coords.latitude, longitude: _location.coords.longitude }}
            image={require('../assets/favicon.png')}
          />)
        }
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
