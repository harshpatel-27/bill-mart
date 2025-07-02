/* eslint-disable @typescript-eslint/no-explicit-any */
import { Models } from "node-appwrite";
import { create } from "zustand";

interface DataState {
  // Categories
  categories: Array<Models.Document>;
  setCategories: (value: Array<Models.Document>) => void;
  removeCategory: (id: string) => void;
  addCategory: (value: Models.Document) => void;

  // Products
  products: Array<Models.Document>;
  setProducts: (value: Array<Models.Document>) => void;
  insertProduct: (value: Models.Document) => void;
  removeProduct: (id: string) => void;

  // Customers
  customers: Array<Models.Document>;
  setCustomers: (value: Array<Models.Document>) => void;
  insertCustomer: (value: Models.Document) => void;
  removeCustomer: (id: string) => void;

  // Invoices
  invoices: Array<Models.Document>;
  setInvoices: (value: Array<Models.Document>) => void;
  insertInvoice: (value: Models.Document) => void;
  removeInvoice: (id: string) => void;

  // Hydration
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
}

export const useDataStore = create<DataState>()((set, get) => ({
  // Categories
  categories: [],
  setCategories: (value) => set({ categories: value }),
  removeCategory: (id) =>
    set({ categories: get()?.categories.filter(({ $id }) => $id != id) }),
  addCategory: (value) => set({ categories: [value, ...get()?.categories] }),

  // Products
  products: [],
  setProducts: (value) => set({ products: value }),
  insertProduct: (value) => set({ products: [value, ...get()?.products] }),
  removeProduct: (id) =>
    set({ products: get()?.products.filter(({ $id }) => $id != id) }),

  // Customers
  customers: [],
  setCustomers: (value) => set({ customers: value }),
  insertCustomer: (value) => set({ customers: [value, ...get()?.customers] }),
  removeCustomer: (id) =>
    set({ customers: get()?.customers.filter(({ $id }) => $id != id) }),

  // Invoices
  invoices: [],
  setInvoices: (value) => set({ invoices: value }),
  insertInvoice: (value) => set({ invoices: [value, ...get()?.invoices] }),
  removeInvoice: (id) =>
    set({ invoices: get()?.invoices.filter(({ $id }) => $id != id) }),

  // Hydration
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value }),
}));
