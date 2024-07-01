import axios from "axios";
import { useNetInfo } from "@react-native-community/netinfo";

const { type } = useNetInfo();

export const api = axios.create({
  baseURL: type !== "wifi" ? 'http://192.168.10.172:3005' : "http://192.168.10.172:3005"
});