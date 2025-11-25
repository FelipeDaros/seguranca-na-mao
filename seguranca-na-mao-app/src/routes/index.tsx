import { NavigationContainer } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { useAuth } from "../contexts/AuthContext";
import { NoAuthRoutes } from "./noAuth.routes";
import { View } from "react-native";

export function Routes() {
  const { userAuth } = useAuth();

  return (
    <View className="flex-1 bg-background-escuro">
      <NavigationContainer>
        {!!userAuth ? <AuthRoutes /> : <NoAuthRoutes />}
      </NavigationContainer>
    </View>
  );
}
