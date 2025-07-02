"use client";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category.schema";
import { useState } from "react";
import { insertCategory } from "@/actions";
import { ArrowLeft } from "lucide-react";
import { useDataStore } from "@/stores/data.store";
import Link from "next/link";
import { BackBtn } from "@/components/back-btn";

export const AddCategoryForm = () => {
  const router = useRouter();
  const addCategory = useDataStore((state) => state.addCategory);
  const categories = useDataStore((state) => state.categories);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateCategory = async (values: CreateCategorySchemaType) => {
    const loadingToast = toast.loading("Creating category...", {
      duration: Infinity,
    });
    setIsLoading(true);
    const addedCategory = await insertCategory(values);
    if (addedCategory?.success) {
      toast.dismiss(loadingToast);
      toast.success("Category Added Successfully");
      if (addedCategory.data) {
        addCategory(addedCategory.data);
      }
      router.push("/categories");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Failed to add category");
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <Card className={`mx-auto w-full rounded-2xl shadow-none border-0`}>
        <BackBtn />
        <CardHeader>
          <CardTitle className="text-2xl">Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleCreateCategory)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <CustomInput
              placeholder={"Enter Category Name"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"name"}
              label={"Category Name"}
            />

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  router.back();
                }}
                className="w-[100px]"
                type="button"
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button className="w-[100px]" type="submit" disabled={isLoading}>
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};
