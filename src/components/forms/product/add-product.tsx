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
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product.schema";
import { useState } from "react";
import { insertProduct } from "@/actions";
import { ArrowLeft } from "lucide-react";
import { useDataStore } from "@/stores/data.store";
import Link from "next/link";
import { SelectWithSearch } from "@/components/shared/SelectWithSearch";
import { BackBtn } from "@/components/back-btn";

export const AddProductForm = () => {
  const router = useRouter();
  const addProduct = useDataStore((state) => state.insertProduct);
  const categories = useDataStore((state) => state.categories);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
    },
  });

  const handleCreateProduct = async (values: CreateProductSchemaType) => {
    const loadingToast = toast.loading("Creating Product...", {
      duration: Infinity,
    });
    setIsLoading(true);
    const isProductAdded = await insertProduct(values);
    if (isProductAdded?.success) {
      toast.dismiss(loadingToast);
      toast.success("Product Added Successfully");
      if (isProductAdded.data) {
        addProduct(isProductAdded.data);
      }
      router.push("/");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Failed to add product");
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <Card className={`mx-auto w-full rounded-2xl shadow-none border-0`}>
        <BackBtn />
        <CardHeader>
          <CardTitle className="text-2xl">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleCreateProduct)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <SelectWithSearch
              items={categories}
              control={form.control}
              placeholder={"Select Category"}
              notFoundText="No Category Found"
              bind_label="name"
              bind_value="$id"
              searchText="Search Categories..."
              name={"category"}
              label={"Select Category"}
              onSelectChange={(value) => {
                form.setValue("category", value);
              }}
            />
            <CustomInput
              placeholder={"Enter Product Name"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"name"}
              label={"Product Name"}
            />
            <CustomInput
              type="number"
              placeholder={"Enter Price"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"price"}
              label={"Product Price"}
            />
            <CustomInput
              type="number"
              placeholder={"Enter Stock"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"stock"}
              label={"Product Stock"}
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
