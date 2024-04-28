import { NavigationContainer } from "@react-navigation/native";
import { Box } from "native-base";
import { AuthRoutes } from "./auth.routes";
import { useAuth } from "../contexts/AuthContext";
import { NoAuthRoutes } from "./noAuth.routes";
import { useEffect, useState } from "react";

export function Routes() {
  const { user } = useAuth();
  
  return (
    <Box flex={1} bg="white">
      <NavigationContainer>
        {!!user ? <AuthRoutes /> : <NoAuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
