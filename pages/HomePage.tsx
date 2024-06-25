import { View } from "react-native";
import { Button } from "react-native";
import useAuth from "../hooks/useAuth";

function HomePage({navigation}) {
  const {authData, login, logout} = useAuth()
  return (<View>
    <Button title="camera" onPress={()=>{navigation.navigate("camera")}}></Button>
    <Button title="image" onPress={()=>{navigation.navigate("image")}}></Button>
    <Button title="chat" onPress={()=>{navigation.navigate("chat")}}></Button>
    <Button title="map" onPress={()=>{navigation.navigate("map")}}></Button>
    </View>)
}
export default HomePage