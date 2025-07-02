"use client";

import { AddCustomerForm } from "@/components/forms/customers/add-customer";
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
  return <AddCustomerForm />;
};

export default AddProductPage;
