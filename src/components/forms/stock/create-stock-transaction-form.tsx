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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CreateStockTransactionSchema,
  CreateStockTransactionType,
} from "@/schema/stocks.schema";
import { useEffect, useState } from "react";
import { createStockTransaction } from "@/actions";
import { useDataStore } from "@/stores/data.store";
import { SelectWithSearch } from "@/components/shared/SelectWithSearch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatProduct } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const CreateStockTransactionForm = () => {
  const router = useRouter();
  const products = useDataStore((state) => state.products);
  const setProducts = useDataStore((state) => state.setProducts);
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const transactionType = searchParams.get("type");
  const extraLabels = searchParams.get("extraLabels")
    ? JSON.parse(searchParams.get("extraLabels") ?? "")
    : "";
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const form = useForm<CreateStockTransactionType>({
    resolver: zodResolver(CreateStockTransactionSchema),
    defaultValues: {
      no_of_items: 0,
      product: productId ?? "",
      remarks: "",
      transaction_date: new Date(),
      type: transactionType
        ? (transactionType.toUpperCase() as "IN" | "OUT")
        : undefined,
      custom_fields: extraLabels,
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "custom_fields" as never,
  });

  const handleUpdateStock = async (values: CreateStockTransactionType) => {
    const loadingToast = toast.loading("Updating Stock...", {
      duration: Infinity,
    });
    setIsUpdating(true);
    const isStockUpdated = await createStockTransaction(values);
    if (isStockUpdated?.success) {
      form.reset();
      toast.dismiss(loadingToast);
      toast.success("Stock updated successfully");
      const newProductArr = products.map((product) => {
        if (product.$id == values.product) {
          delete isStockUpdated?.data?.product;
          product.stockTransactions.push(isStockUpdated.data);
        }
        return product;
      });
      const tempProductArr = formatProduct(newProductArr);
      setProducts(tempProductArr);
      router.push("/");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Failed to update stock");
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    if (extraLabels) return;
    if (!selectedProductId) {
      if (form.getValues("product")) {
        setSelectedProductId(form.getValues("product"));
      }
      return;
    }
    const product = products.find(({ $id }) => $id == selectedProductId);
    const newFields = product?.custom_fields?.map((ele) => {
      return { label: ele, value: "" };
    });
    form.setValue("custom_fields", []);
    append([...newFields]);
  }, [selectedProductId]);

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
          <CardTitle className="text-2xl">Update Stock Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleUpdateStock)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <SelectWithSearch
              items={products}
              control={form.control}
              placeholder={"Select Product"}
              notFoundText="No Product Found"
              searchText="Search Product..."
              name={"product"}
              label={"Select Product"}
              bind_label="name"
              bind_value="$id"
              onSelectChange={(value) => {
                form.setValue("product", value);
                setSelectedProductId(value);
              }}
            />
            {fields.map((ele, index) => {
              return (
                <FormField
                  key={ele.id}
                  control={form.control}
                  name={`custom_fields.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Extra Field :{" "}
                        {form.watch(`custom_fields.${index}.label`) || ""}
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input {...field} placeholder={`Enter Label`} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex w-full border gap-0 rounded-lg overflow-hidden"
                    >
                      <FormItem
                        className={cn(
                          " cursor-pointer flex items-center w-full text-center border-r",
                          field.value == "IN" ? "bg-primary text-white" : "",
                        )}
                      >
                        <FormControl className="hidden">
                          <RadioGroupItem value="IN" />
                        </FormControl>
                        <FormLabel className="p-4 w-full cursor-pointer">
                          IN
                        </FormLabel>
                      </FormItem>
                      <FormItem
                        className={cn(
                          "cursor-pointer flex items-center w-full text-center",
                          field.value == "OUT" ? "bg-primary text-white" : "",
                        )}
                      >
                        <FormControl className="hidden">
                          <RadioGroupItem value="OUT" />
                        </FormControl>
                        <FormLabel className="p-4 w-full cursor-pointer">
                          OUT
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 max-sm:flex-col">
              <FormField
                control={form.control}
                name={"no_of_items"}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enter Quantity</FormLabel>
                    <FormControl>
                      <Input
                        className={`max-sm:!max-h-12 !max-h-10 !mt-[2px]`}
                        placeholder={"Enter quantity in number here"}
                        type={"number"}
                        {...field}
                        onChange={(ele) =>
                          form.setValue(
                            "no_of_items",
                            parseInt(ele.currentTarget.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomInput
                placeholder={"Enter text here"}
                control={form.control}
                className="max-sm:!max-h-12 !max-h-10 !mt-[2px] "
                name={"transaction_date"}
                label={"Date"}
                inputType="calendar"
              />
            </div>
            <CustomInput
              placeholder={"Enter remarks"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"remarks"}
              label={"Remarks"}
              isTextArea
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
              <Button className="w-[100px]" type="submit" disabled={isUpdating}>
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};
