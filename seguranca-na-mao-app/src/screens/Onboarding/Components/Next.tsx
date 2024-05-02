import { Icon, Pressable } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const Next = ({ ...props }) => (
  <Pressable
    {...props}
  >
    <Icon
      m={2}
      size={8}
      as={MaterialCommunityIcons}
      color="personColors.50"
      name="arrow-right-bold-circle"
    />
  </Pressable>
);