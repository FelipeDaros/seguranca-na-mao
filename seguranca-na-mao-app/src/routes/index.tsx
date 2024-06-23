import { NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { useAuth } from "../contexts/AuthContext";
import { NoAuthRoutes } from "./noAuth.routes";
import { RoutesRoundActive } from "./routesRoundActive";
import { View } from "react-native";

export function Routes() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!!user ? (user.isRondaActive ? <RoutesRoundActive /> : <AuthRoutes />) : <NoAuthRoutes />}
      {/* <NoAuthRoutes /> */}
    </NavigationContainer>
  );
}
