"use client";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product.schema";
import { useState } from "react";
import { insertProduct } from "@/actions";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TrashIcon } from "lucide-react";
import { useDataStore } from "@/stores/data.store";
import Link from "next/link";

export const AddProductForm = () => {
  const router = useRouter();
  const addProduct = useDataStore((state) => state.insertProduct);
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<CreateProductSchemaType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      custom_fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "custom_fields" as never,
  });

  const handleCreateEmployee = async (values: CreateProductSchemaType) => {
    const loadingToast = toast.loading("Creating Product...", {
      duration: Infinity,
    });
    setIsUpdating(true);
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
    setIsUpdating(false);
  };

  return (
    <Form {...form}>
      <Card className={`mx-auto w-full rounded-2xl shadow-none border-0`}>
        <Link
          href={"/"}
          className="text-primary flex items-center justify-start gap-1 text-xs cursor-pointer"
        >
          <ArrowLeft className="size-4" /> Back to Home
        </Link>
        <CardHeader>
          <CardTitle className="text-2xl">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleCreateEmployee)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <CustomInput
              placeholder={"Enter Product Name"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"name"}
              label={"Product Name"}
            />

            <div className="bg-secondary rounded-md p-1 py-3 flex flex-col gap-3 items-center justify-center">
              {fields.map((field, index) => {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`custom_fields.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Label {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} placeholder="Enter Field Label" />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => remove(index)}
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}

              <Button
                type="button"
                variant={"outline"}
                onClick={() =>
                  form.setValue("custom_fields", [
                    ...form.getValues("custom_fields"),
                    "",
                  ])
                }
              >
                Add extra field
              </Button>
            </div>

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
              <Button className="w-[100px]" type="submit" disabled={isUpdating}>
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};
