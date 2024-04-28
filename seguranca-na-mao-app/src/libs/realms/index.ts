import { createRealmContext } from "@realm/react"
import { GerarRondas } from "./schemas/Rondas";
import { Pontos } from "./schemas/Pontos";
import { Alerta } from "./schemas/Alerta";

export const {
  RealmProvider, useObject, useQuery, useRealm
} = createRealmContext({
  schema: [GerarRondas, Pontos, Alerta]
});