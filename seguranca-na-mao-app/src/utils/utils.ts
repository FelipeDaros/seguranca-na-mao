import moment from "moment-timezone";

function generateRandomNumber() {
    const min = 100000; // Menor número de 6 dígitos
    const max = 999999; // Maior número de 6 dígitos
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNowTimesTamp() {
    const timezone = "America/Sao_Paulo";
    const dateMoment = moment().tz(timezone);

    // Formatar a saída incluindo o fuso horário
    return dateMoment.format();
}

function generateNowTimesTampAddMinutesForConfiguration(configuracao: number) {
    const timezone = "America/Sao_Paulo";

    const dateMoment = moment().tz(timezone);

    // Adicionar minutos à data
    const dataComMinutosAdicionados = dateMoment.add(configuracao, 'minutes');

    // Formatar a saída incluindo o fuso horário
    return dataComMinutosAdicionados.format();
}


export { generateNowTimesTamp, generateRandomNumber, generateNowTimesTampAddMinutesForConfiguration };