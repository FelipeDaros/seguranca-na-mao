import { HStack, Input, Select, Text, VStack } from "native-base";
import { IVigilanteConfig } from "../../../interfaces/IVigilanteConfig";
import CustomInput from "../../../components/CustomInput";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import CustomButton from "../../../components/CustomButton";


interface Props {
    configuracao: Configuracoes;
    updateConfiguracao: (configuracao: Configuracoes) => void;
}

interface Configuracoes {
    id: number;
    tipo: 'RONDA' | 'ALERTA';
    valor: number;
    parametro: string;
    usuario_id: string
    created_at: Date;
}

const _OPCOES = [
    {
        value: 'minutes',
        label: 'Minutos'
    }
];

export function CardConfiguracao({ configuracao, updateConfiguracao }: Props) {
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        getFieldState,
        formState: { errors },
    } = useForm<Configuracoes>({});

    function handleDataInputs() {
        setValue('tipo', configuracao.tipo);
        setValue('parametro', configuracao.parametro);
        setValue('valor', configuracao.valor);
        setValue('id', configuracao.id);
    }

    useEffect(() => {
        handleDataInputs();
    }, []);

    return (
        <VStack key={configuracao.id} alignItems="center" justifyItems="center" my="4">
            <Text color="personColors.150" fontFamily="heading">Configuração: {configuracao.tipo}</Text>
            <Controller
                control={control}
                rules={{
                    maxLength: 100,
                    required: false,
                    minLength: 6
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <Text
                            color="personColors.150"
                            fontFamily="body"
                            fontSize="md"
                            ml="10"
                            mt="6"
                            alignSelf="flex-start"
                        >
                            ID
                        </Text>
                        <CustomInput
                            bg="white"
                            borderColor={errors.tipo && 'error.500'}
                            mt="2"
                            isDisabled
                            onChangeText={(text) => { onChange(text), updateConfiguracao(getValues()) }}
                            value={String(value)}
                        />
                    </>
                )}
                name="id"
            />
            <Controller
                control={control}
                rules={{
                    maxLength: 100,
                    required: false,
                    minLength: 6
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <Text
                            color="personColors.150"
                            fontFamily="body"
                            fontSize="md"
                            ml="10"
                            mt="6"
                            alignSelf="flex-start"
                        >
                            Tipo
                        </Text>
                        <CustomInput
                            bg="white"
                            borderColor={errors.tipo && 'error.500'}
                            mt="2"
                            onChangeText={(text) => { onChange(text), updateConfiguracao(getValues()) }}
                            value={value}
                            isDisabled
                        />
                    </>
                )}
                name="tipo"
            />
            {errors.tipo && <Text color={"error.500"} my="2">Campo é obrigatório</Text>}
            <Controller
                control={control}
                rules={{
                    maxLength: 100,
                    required: false,
                    minLength: 6
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <Text
                            color="personColors.150"
                            fontFamily="body"
                            fontSize="md"
                            ml="10"
                            mt="6"
                            alignSelf="flex-start"
                        >
                            Parâmetro
                        </Text>
                        <Select
                            onValueChange={(text) => { onChange(text), updateConfiguracao(getValues()) }}
                            selectedValue={value}
                            w="80%"
                            borderColor="personColors.150"
                            borderWidth={0}
                            bg="white"
                            placeholder="Informe o parâmetro"
                            >
                                {_OPCOES.map(opcao => (
                                    <Select.Item key={opcao.value} value={opcao.value} label={opcao.label}/>
                                ))}
                        </Select>
                    </>
                )}
                name="parametro"
            />
            {errors.parametro && <Text color={"error.500"} my="2">Campo é obrigatório</Text>}
            <Controller
                control={control}
                rules={{
                    maxLength: 100,
                    required: false,
                    minLength: 6
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <Text
                            color="personColors.150"
                            fontFamily="body"
                            fontSize="md"
                            ml="10"
                            mt="6"
                            alignSelf="flex-start"
                        >
                            Valor
                        </Text>
                        <CustomInput
                            bg="white"
                            borderColor={errors.valor && 'error.500'}
                            mt="2"
                            onChangeText={(text) => { onChange(text), updateConfiguracao(getValues()) }}
                            value={String(value)}
                        />
                    </>
                )}
                name="valor"
            />
            {errors.valor && <Text color={"error.500"} my="2">Campo é obrigatório</Text>}
        </VStack>
    )
}