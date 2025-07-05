"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ProductSchema, ProductSchemaType } from "@/schema/product.schema";
import { insertProduct, updateProduct } from "@/actions";
import { useDataStore } from "@/stores/data.store";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectWithSearch } from "@/components/shared/SelectWithSearch";
import { BackBtn } from "@/components/back-btn";
import { CustomLoader } from "@/components/loader";

type ProductFormProps = {
  type: "create" | "update";
  productId?: string;
};

export const ProductForm = ({ type, productId }: ProductFormProps) => {
  const router = useRouter();
  const addProduct = useDataStore((state) => state.insertProduct);
  const products = useDataStore((state) => state.products);
  const updateLocalProduct = useDataStore((state) => state.updateProduct);
  const categories = useDataStore((state) => state.categories);
  const isHydrated = useDataStore((state) => state.hydrated);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      category: "",
    },
  });

  useEffect(() => {
    if (type == "update" && isHydrated) {
      const defaultValues = products.find(({ $id }) => $id == productId);
      console.log({ defaultValues });
      form.setValue("name", defaultValues?.name);
      form.setValue("category", defaultValues?.category.$id);
      form.setValue("price", defaultValues?.price);
      form.setValue("stock", defaultValues?.stock);
    }
  }, [type, products, isHydrated]);

  const handleSubmit = async (values: ProductSchemaType) => {
    const loadingToast = toast.loading(
      type === "create" ? "Creating Product..." : "Updating Product...",
      {
        duration: Infinity,
      },
    );
    setIsLoading(true);

    let result;

    if (type === "create") {
      result = await insertProduct(values);
    } else if (type === "update" && productId) {
      result = await updateProduct(productId, values);
    }

    toast.dismiss(loadingToast);

    if (result?.success) {
      toast.success(
        type === "create"
          ? "Product Added Successfully"
          : "Product Updated Successfully",
      );

      if (type === "create" && result.data) {
        addProduct(result.data);
      } else if (type === "update" && result.data) {
        updateLocalProduct(result.data);
      }

      router.push("/");
    } else {
      toast.error(
        type === "create"
          ? "Failed to add product"
          : "Failed to update product",
      );
    }

    setIsLoading(false);
  };

  if (!isHydrated) {
    return <CustomLoader />;
  }

  return (
    <Form {...form}>
      <Card className={`mx-auto w-full rounded-2xl shadow-none border-0`}>
        <BackBtn />
        <CardHeader>
          <CardTitle className="text-2xl">
            {type === "create" ? "Add Product" : "Edit Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
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
                {type === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};
