import moment from "moment-timezone";
import { getAllPontos } from "../store/PontoStorage";
import { createRonda } from "../store/RondaStorage";
import { generateRandomNumber } from "../utils/utils";
import { IUsuario } from "../interfaces/IUsuario";

export async function gerarRondasService(user: IUsuario) {
  try {
    const pontos = await getAllPontos();

    pontos.forEach(async ponto => {
      await createRonda({
        id: generateRandomNumber(),
        nome: ponto.nome,
        isSincronized: false,
        atrasado: false,
        cancelado: false,
        maximo_horario: moment().add(15, 'minutes').format(),
        motivo: "",
        ponto_id: ponto.id,
        posto_id: ponto.posto_id,
        servico_id: user?.servico?.id,
        user_id: user?.user.id,
        verificado: false
      })
    });
  } catch (error) {
    throw error;
  }
}