import { create } from 'zustand';
import { IEquipamento } from '../interfaces/IEquipamento';
import { IPreviousService } from '../interfaces/IPreviousService';

type Props = {
    isLoading: boolean;
    postId: number | null;
    equipamentosSelecionados: number[];
    equipamentos: IEquipamento[];
    previousService: IPreviousService | null;
    relatorioLido: boolean;
    onChangeRelatorioLido: () => void;
    setIsLoading: () => void;
    onChangeEquipamentos: (data: IEquipamento[]) => void;
    onChangePreviousService: (data: IPreviousService) => void;
    onChangePostId: (id: number) => void;
    onHandleEquipamento: (id: number) => void;
    checkListStoreClear: () => void;
}

export const CheckListStore = create<Props>((set, get) => ({
    isLoading: false,
    postId: null,
    equipamentosSelecionados: [],
    equipamentos: [],
    previousService: null,
    relatorioLido: false,
    onChangeRelatorioLido: () => !get().relatorioLido ? set(() => ({ relatorioLido: true })) : set(() => ({ relatorioLido: false })),
    setIsLoading: () => !get().isLoading ? set(() => ({ isLoading: true })) : set(() => ({ isLoading: false })),
    onChangePreviousService: (data: IPreviousService) => set(() => ({ previousService: data })),
    onChangeEquipamentos: (data: IEquipamento[]) => set(() => ({ equipamentos: data })),
    onChangePostId: (id: number) => set(() => ({ postId: id })),
    onHandleEquipamento: (id: number) => {
        if (get().equipamentosSelecionados.some(item => item === id)) {
            set((state) => ({ equipamentosSelecionados: state.equipamentosSelecionados.filter(item => item !== id) }));
        } else {
            set((state) => ({ equipamentosSelecionados: [...state.equipamentosSelecionados, id] }));
        }
    },
    checkListStoreClear: () => set({
        isLoading: false,
        postId: null,
        equipamentosSelecionados: [],
        equipamentos: [],
        previousService: null,
        relatorioLido: false,
    })
}));
