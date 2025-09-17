"use client";
import {
  getCategories,
  getCustomers,
  getInvoices,
  getProducts,
} from "@/actions";
import { getAccount } from "@/actions/user";
import { fetchByRoute } from "@/lib/constants";
import { checkPathnames } from "@/lib/utils";
import { useDataStore } from "@/stores/data.store";
import { usePathname, useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { useEffect, useLayoutEffect } from "react";

export const InitData = ({
  account,
  products,
  categories,
  customers,
  invoices,
}: {
  account: Models.User<Models.Preferences> | null;
  products: Models.DocumentList<Models.Document>;
  categories: Models.DocumentList<Models.Document>;
  customers: Models.DocumentList<Models.Document>;
  invoices: Models.DocumentList<Models.Document>;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    categories: storeCategories,
    customers: storeCustomers,
    products: storeProducts,
    invoices: storeInvoices,
    setProducts,
    setCategories,
    setCustomers,
    setHydrated,
    setInvoices,
  } = useDataStore((state) => state);

  const isHydrated = useDataStore((state) => state.hydrated);
  useLayoutEffect(() => {
    if (!isHydrated) {
      handleCheckAuthandInitData();
    }
  }, []);

  useLayoutEffect(() => {
    handlePathnameChange();
  }, [pathname]);

  const handlePathnameChange = async () => {
    if (storeProducts.length == 0) {
      const tempProducts = await getProducts();
      setProducts(tempProducts?.documents || []);
    }

    if (storeCategories.length == 0) {
      if (checkPathnames(pathname, fetchByRoute.categories)) {
        const tempCategories = await getCategories();
        setCategories(tempCategories?.documents || []);
      }
    }

    if (storeCustomers.length == 0) {
      if (checkPathnames(pathname, fetchByRoute.customers)) {
        const tempCustomers = await getCustomers();
        setCustomers(tempCustomers?.documents || []);
      }
    }

    if (storeInvoices.length == 0) {
      if (checkPathnames(pathname, fetchByRoute.invoices)) {
        const tempInvoices = await getInvoices();
        setInvoices(tempInvoices?.documents || []);
      }
    }
  };

  const handleCheckAuthandInitData = async () => {
    if (!account) {
      const checkAccount = await getAccount();
      if (!checkAccount) {
        router.push("/sign-in");
        return;
      }
    }

    let tempProducts;
    if (products.documents.length) {
      tempProducts = products;
    } else {
      tempProducts = await getProducts();
    }
    setProducts(tempProducts?.documents || []);

    let tempCategories;
    if (categories?.documents?.length) {
      tempCategories = categories;
    } else if (checkPathnames(pathname, ["products/add", "categories"])) {
      tempCategories = await getCategories();
    }
    setCategories(tempCategories?.documents || []);

    let tempCustomers;
    if (customers?.documents?.length) {
      tempCustomers = customers;
    } else if (checkPathnames(pathname, ["customers", "invoices/add"])) {
      tempCustomers = await getCustomers();
    }
    setCustomers(tempCustomers?.documents || []);

    let tempInvoices;
    if (invoices?.documents?.length) {
      tempInvoices = invoices;
    } else if (checkPathnames(pathname, ["invoices"])) {
      tempInvoices = await getInvoices();
    }
    setInvoices(tempInvoices?.documents || []);

    setHydrated(true);
  };
  return null;
};
