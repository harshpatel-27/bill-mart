"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CreateCustomerSchema,
  CreateCustomerSchemaType,
} from "@/schema/customer.schema";
import { insertCustomer, updateCustomer } from "@/actions";
import { useDataStore } from "@/stores/data.store";

import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackBtn } from "@/components/back-btn";
import { CustomLoader } from "@/components/loader";

type CustomerFormProps = {
  type: "create" | "update";
  customerId?: string;
};

export const CustomerForm = ({ type, customerId }: CustomerFormProps) => {
  const router = useRouter();
  const addCustomer = useDataStore((state) => state.insertCustomer);
  const updateLocalCustomer = useDataStore((state) => state.updateCustomer);
  const customers = useDataStore((state) => state.customers);
  const isHydrated = useDataStore((state) => state.hydrated);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCustomerSchemaType>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (type === "update" && isHydrated) {
      const customer = customers.find((c) => c.$id === customerId);
      if (!customer?.$id) {
        toast.error("Customer not found with the requested Id");
        router.replace("/customers");
        return;
      }

      form.setValue("name", customer.name);
      form.setValue("email", customer.email);
      form.setValue("phone", customer.phone);
    }
  }, [type, customerId, customers, isHydrated]);

  const handleSubmit = async (values: CreateCustomerSchemaType) => {
    const loadingToast = toast.loading(
      type === "create" ? "Creating customer..." : "Updating customer...",
      { duration: Infinity },
    );

    setIsLoading(true);

    let result;
    if (type === "create") {
      result = await insertCustomer(values);
    } else if (type === "update" && customerId) {
      result = await updateCustomer(customerId, values);
    }

    toast.dismiss(loadingToast);

    if (result?.success) {
      toast.success(
        type === "create"
          ? "Customer Added Successfully"
          : "Customer Updated Successfully",
      );

      if (type === "create" && result.data) {
        addCustomer(result.data);
      } else if (type === "update" && result.data) {
        updateLocalCustomer(result.data);
      }

      router.replace("/customers");
    } else {
      toast.error(
        type === "create"
          ? "Failed to add customer"
          : "Failed to update customer",
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
            {type === "create" ? "Add Customer" : "Edit Customer"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <CustomInput
              placeholder="Enter Customer Name"
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name="name"
              label="Customer Name"
            />
            <CustomInput
              type="number"
              placeholder="Enter Customer Mobile"
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name="phone"
              label="Customer Mobile"
            />
            <CustomInput
              placeholder="Enter Customer Email"
              control={form.control}
              className="max-sm:!max-h-12 !max-h-10 !mt-[2px]"
              name="email"
              label="Customer Email"
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
