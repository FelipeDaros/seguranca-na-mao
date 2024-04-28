import { extendTheme } from "native-base";

export const THEME = extendTheme({
  colors: {
    personColors: {
      50: "#1A998E",
      100: "#F1FCFB",
      150: "#787B80",
      200: "#1C1B1F",
    },
  },
  fonts: {
    body: "Inter_400Regular",
    heading: "Inter_700Bold",
    mono: "Inter_500Medium",
  }
});
