import { Icon, Pressable } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const Done = ({ ...props }) => (
  <Pressable
    {...props}
  >
    <Icon
      m={2}
      size={8}
      as={MaterialCommunityIcons}
      color="personColors.50"
      name="check-circle"
    />
  </Pressable>
);