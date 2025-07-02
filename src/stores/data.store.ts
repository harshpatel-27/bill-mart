/* eslint-disable @typescript-eslint/no-explicit-any */
import { Models } from "node-appwrite";
import { create } from "zustand";

interface DataState {
  categories: Array<Models.Document>;
  setCategories: (value: Array<Models.Document>) => void;
  addCategory: (value: Models.Document) => void;
  products: Array<Models.Document>;
  setProducts: (value: Array<Models.Document>) => void;
  insertProduct: (value: Models.Document) => void;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
}

export const useDataStore = create<DataState>()((set, get) => ({
  categories: [],
  setCategories: (value) => set({ categories: value }),
  addCategory: (value) => set({ categories: [value, ...get()?.products] }),
  products: [],
  setProducts: (value) => set({ products: value }),
  insertProduct: (value) => set({ products: [value, ...get()?.products] }),
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value }),
}));
