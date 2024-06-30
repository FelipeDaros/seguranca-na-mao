import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.3.27:3005"
});

// baseURL: "http://192.168.3.27:3005" casa
// baseURL: "http://192.168.0.113:3005"  torneiro
//192.168.3.27
//http://192.168.3.24:3005
//https://backend-seguranca-na-mao.onrender.com