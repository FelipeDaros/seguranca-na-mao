import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.3.42:3005"
});