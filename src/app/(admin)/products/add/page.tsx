"use client";

import { AddProductForm } from "@/components/forms/product/add-product";
import { useDataStore } from "@/stores/data.store";
import { Loader } from "lucide-react";
import React from "react";

const AddProductPage = () => {
  const isHydrated = useDataStore((state) => state.hydrated);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }
  return <AddProductForm />;
};

export default AddProductPage;
