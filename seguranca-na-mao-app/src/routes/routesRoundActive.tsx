import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Round } from "../screens/Round";
// import { RoundSelected } from "../screens/Round/Components/RoundSelected";

export function RoutesRoundActive() {
  const { Screen, Navigator} = createNativeStackNavigator();
  return (
    <Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Screen name="Round" component={Round} />
      {/* <Screen name="RoundSelected" component={RoundSelected} /> */}
    </Navigator>
  );
}
