"use client";

import * as z from "zod";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateStockTransactionSchema,
  CreateStockTransactionType,
} from "@/schema/stocks.schema";
import { useState } from "react";
import { createStockTransaction } from "@/actions";
import { format } from "date-fns";

const CreateStockTransactionForm = () => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<CreateStockTransactionType>({
    resolver: zodResolver(CreateStockTransactionSchema),
    defaultValues: {
      no_of_items: 1,
      product: "",
      remarks: "",
      transaction_date: new Date(),
      type: undefined,
    },
  });

  const handleCreateEmployee = async (values: CreateStockTransactionType) => {
    const loadingToast = toast.loading("Creating Employee...", {
      duration: Infinity,
    });
    setIsUpdating(true);
    const isEmployeeCreated = await createStockTransaction(values);
    if (isEmployeeCreated?.success) {
      form.reset();

      toast.dismiss(loadingToast);
      toast.success("Stock updated successfully");
      router.push("/");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Failed to update stock");
    }
    setIsUpdating(false);
  };

  return (
    <Form {...form}>
      <Card className={`mx-auto w-full rounded-2xl shadow-none border-0`}>
        <CardHeader>
          <CardTitle className="text-2xl">Update Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleCreateEmployee)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <div className="flex items-center justify-start gap-3">
              <CustomInput
                placeholder={"Enter text here"}
                control={form.control}
                className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
                name={"no_of_items"}
                label={"No. Of Items"}
                type="number"
              />
              <CustomInput
                placeholder={"Enter text here"}
                control={form.control}
                className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
                name={"transaction_date"}
                label={"Date"}
                inputType="calendar"
              />
            </div>
            {/* <div className="flex items-center justify-start gap-3"> */}
            {/* <SelectWithSearch
                items={statesList}
                control={form.control}
                placeholder={"Select State"}
                notFoundText="No State Found"
                searchText="Search State..."
                name={"state"}
                label={"Select State"}
                onSelectChange={(value) => {
                  setSelectedState(value);
                  form.setValue("state", value);
                  form.setValue("city", "");
                }}
              />

              <SelectWithSearch
                items={cityList[selectedState || ""] || []}
                control={form.control}
                placeholder={"Select City"}
                disabled={!selectedState}
                notFoundText="No City Found"
                searchText="Search City..."
                name={"city"}
                label={"Select City"}
                onSelectChange={(value) => {
                  form.setValue("city", value);
                }}
              /> */}
            {/* </div> */}
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

export default CreateStockTransactionForm;
