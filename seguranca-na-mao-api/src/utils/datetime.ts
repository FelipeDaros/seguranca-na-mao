import * as moment from "moment";


export function horarioAtual() {
    return moment().tz("America/Sao_Paulo").format('YYYY-MM-DD HH:mm:ss');
}

export function addHorario(value: moment.DurationInputArg1, param: moment.unitOfTime.DurationConstructor) {
    return moment().tz("America/Sao_Paulo").add(value, param).format('YYYY-MM-DD HH:mm:ss');
}

export function horarioAtualConfigurado(){
    return moment().add(-3, 'hours').toDate();
}