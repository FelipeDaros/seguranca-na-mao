import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import { useAuth } from "../contexts/AuthContext";
import Home from "../screens/Home";

export function NoAuthRoutes() {
  const { Screen, Navigator } = createNativeStackNavigator();
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Screen name="Login" component={Login} />
    </Navigator>
  );
}
