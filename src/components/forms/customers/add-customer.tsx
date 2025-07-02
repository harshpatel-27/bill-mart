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
  CreateCustomerSchema,
  CreateCustomerSchemaType,
} from "@/schema/customer.schema";
import { useState } from "react";
import { insertCustomer } from "@/actions";
import { useDataStore } from "@/stores/data.store";
import { BackBtn } from "@/components/back-btn";

export const AddCustomerForm = () => {
  const router = useRouter();
  const addCustomer = useDataStore((state) => state.insertCustomer);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateCustomerSchemaType>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleCreateCustomer = async (values: CreateCustomerSchemaType) => {
    const loadingToast = toast.loading("Creating customer...", {
      duration: Infinity,
    });
    setIsLoading(true);
    const isCustomerAdded = await insertCustomer(values);
    if (isCustomerAdded?.success) {
      toast.dismiss(loadingToast);
      toast.success("Customer Added Successfully");
      if (isCustomerAdded.data) {
        addCustomer(isCustomerAdded.data);
      }
      router.replace("/customers");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Failed to add customer");
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <Card className={`mx-auto w-full rounded-2xl shadow-none border-0`}>
        <BackBtn />
        <CardHeader>
          <CardTitle className="text-2xl">Add Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleCreateCustomer)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <CustomInput
              placeholder={"Enter Customer Name"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"name"}
              label={"Customer Name"}
            />
            <CustomInput
              type="number"
              placeholder={"Enter Customer Mobile"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"phone"}
              label={"Customer Mobile"}
            />
            <CustomInput
              placeholder={"Enter Customer Email"}
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name={"email"}
              label={"Customer Email"}
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
