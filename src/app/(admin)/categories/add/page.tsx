"use client";

import { AddCategoryForm } from "@/components/forms/categories/add-category";
import { useDataStore } from "@/stores/data.store";
import { Loader } from "lucide-react";

const AddCategoryPage = () => {
  const isHydrated = useDataStore((state) => state.hydrated);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }
  return <AddCategoryForm />;
};

export default AddCategoryPage;
