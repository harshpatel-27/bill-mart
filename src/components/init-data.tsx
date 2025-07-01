"use client";
import { getProducts } from "@/actions";
import { getAccount } from "@/actions/user";
import { formatProduct } from "@/lib/utils";
import { useDataStore } from "@/stores/data.store";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { useLayoutEffect } from "react";

export const InitData = ({
  account,
  products,
}: {
  account: Models.User<Models.Preferences> | null;
  products: Models.DocumentList<Models.Document>;
}) => {
  const setProducts = useDataStore((state) => state.setProducts);
  const setHydrated = useDataStore((state) => state.setHydrated);
  const isHydrated = useDataStore((state) => state.hydrated);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isHydrated) {
      handleCheckAuthandInitData();
    }
  }, []);

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

    const newProductsArr = formatProduct(tempProducts?.documents);

    setProducts(newProductsArr);
    setHydrated(true);
  };
  return null;
};
