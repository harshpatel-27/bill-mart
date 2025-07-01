/* eslint-disable @typescript-eslint/no-explicit-any */
import { Models } from "node-appwrite";
import { create } from "zustand";

interface SpecializationState {
  products: Array<Models.Document>;
  setProducts: (value: Array<Models.Document>) => void;
  insertProduct: (value: Models.Document) => void;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
}

export const useDataStore = create<SpecializationState>()((set, get) => ({
  products: [],
  setProducts: (value) => set({ products: value }),
  insertProduct: (value) => set({ products: [value, ...get()?.products] }),
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value }),
}));
