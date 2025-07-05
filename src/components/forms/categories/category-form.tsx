"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategorySchema, CategorySchemaType } from "@/schema/category.schema";
import { insertCategory, updateCategory } from "@/actions";
import { useDataStore } from "@/stores/data.store";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackBtn } from "@/components/back-btn";
import { CustomLoader } from "@/components/loader";

type CategoryFormProps = {
  type: "create" | "update";
  categoryId?: string;
};

export const CategoryForm = ({ type, categoryId }: CategoryFormProps) => {
  const router = useRouter();
  const addCategory = useDataStore((state) => state.addCategory);
  const updateLocalCategory = useDataStore((state) => state.updateCategory);
  const categories = useDataStore((state) => state.categories);
  const isHydrated = useDataStore((state) => state.hydrated);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (type === "update" && isHydrated) {
      const category = categories.find((cat) => cat.$id === categoryId);
      if (!category?.$id) {
        toast.error("Category Not found with the requested Id");
        router.replace("/categories");
      }
      if (category) {
        form.setValue("name", category.name);
      }
    }
  }, [type, categoryId, categories, isHydrated]);

  const handleSubmit = async (values: CategorySchemaType) => {
    const loadingToast = toast.loading(
      type === "create" ? "Creating category..." : "Updating category...",
      { duration: Infinity },
    );

    setIsLoading(true);

    let result;
    if (type === "create") {
      result = await insertCategory(values);
    } else if (type === "update" && categoryId) {
      result = await updateCategory(categoryId, values);
    }

    toast.dismiss(loadingToast);

    if (result?.success) {
      toast.success(
        type === "create"
          ? "Category Added Successfully"
          : "Category Updated Successfully",
      );

      if (type === "create" && result.data) {
        addCategory(result.data);
      } else if (type === "update" && result.data) {
        updateLocalCategory(result.data);
      }

      router.push("/categories");
    } else {
      toast.error(
        type === "create"
          ? "Failed to add category"
          : "Failed to update category",
      );
    }

    setIsLoading(false);
  };

  if (!isHydrated) {
    return <CustomLoader />;
  }

  return (
    <Form {...form}>
      <Card className="mx-auto w-full rounded-2xl shadow-none border-0">
        <BackBtn />
        <CardHeader>
          <CardTitle className="text-2xl">
            {type === "create" ? "Add Category" : "Edit Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <CustomInput
              placeholder="Enter Category Name"
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name="name"
              label="Category Name"
            />

            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.back()}
                className="w-[100px]"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="w-[100px]" type="submit" disabled={isLoading}>
                {type === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};
