export interface IVigilanteConfig {
    id: string;
    nome: string;
    email: string;
    created_at: Date;
    ultimo_login: Date;
    isAdmin: boolean;
    posto_id: number;
    empresa_id: number;
    horario_alerta: Date;
    tipo_usuario: string;
    Configuracoes: Configuracoes[]
}

interface Configuracoes {
    id: number;
    tipo: 'RONDA' | 'ALERTA';
    valor: number;
    parametro: string;
    usuario_id: string
    created_at: Date;
}