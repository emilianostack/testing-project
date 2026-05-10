import { create } from "zustand";
import { CategoriaProps } from "../pages/categoria/cadastrar";
import { LivroProps } from "../pages/livros/listar";

export interface StoreState {
  livros: LivroProps[];
  categorias: CategoriaProps[];
  recarregarLivros: boolean;
  recarregarCategorias: boolean;
  atualizarLivros: (livros: LivroProps[]) => void;
  atualizarCategorias: (categorias: CategoriaProps[]) => void;
  alterarStatusLivros: (status: boolean) => void;
  alterarStatusCategorias: (status: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  livros: [],
  categorias: [],
  recarregarLivros: false,
  recarregarCategorias: false,
  atualizarLivros: (livros) => set({ livros }),
  atualizarCategorias: (categorias) => set({ categorias }),
  alterarStatusLivros: (status) => set({ recarregarLivros: status }),
  alterarStatusCategorias: (status) => set({ recarregarCategorias: status }),
}));
