"use client";

import { CreateStockTransactionForm } from "@/components/forms/stock/create-stock-transaction-form";
import { useDataStore } from "@/stores/data.store";
import { Loader } from "lucide-react";
import React from "react";

const AddStockPage = () => {
  const isHydrated = useDataStore((state) => state.hydrated);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }
  return <CreateStockTransactionForm />;
};

export default AddStockPage;
