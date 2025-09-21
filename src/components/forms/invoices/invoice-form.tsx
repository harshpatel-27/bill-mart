"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, XIcon } from "lucide-react";

import {
  CreateInvoiceSchema,
  CreateInvoiceSchemaType,
} from "@/schema/invoices.schema";
import { insertInvoice, updateInvoice, verifyOtp } from "@/actions";
import { useDataStore } from "@/stores/data.store";

import { BackBtn } from "@/components/back-btn";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectWithSearch } from "@/components/shared/SelectWithSearch";
import { CustomLoader } from "@/components/loader";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn, sendTelegramMessage } from "@/lib/utils";
import { invoiceReceiptUrlPrefix } from "@/lib/constants";
import { sendOtpEmail } from "@/actions";

type InvoiceFormProps = {
  type: "create" | "update";
  invoiceId?: string;
};

export const InvoiceForm = ({ type, invoiceId }: InvoiceFormProps) => {
  const router = useRouter();
  const addInvoice = useDataStore((state) => state.insertInvoice);
  const updateInvoiceState = useDataStore((state) => state.updateInvoice);
  const setProducts = useDataStore((state) => state.setProducts);
  const invoices = useDataStore((state) => state.invoices);
  const products = useDataStore((state) => state.products);
  const customers = useDataStore((state) => state.customers);
  const isHydrated = useDataStore((state) => state.hydrated);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateInvoiceSchemaType>({
    resolver: zodResolver(CreateInvoiceSchema),
    defaultValues: {
      customerId: "",
      items:
        type == "create" ? [{ productId: "", quantity: "1", amount: 0 }] : [],
      total: 0,
      paymentMethod: "CASH",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  useEffect(() => {
    if (type === "update" && isHydrated) {
      const invoice = invoices.find((inv) => inv?.$id === invoiceId);
      if (!invoice?.$id) {
        toast.error("Invoice not found with the requested Id");
        router.replace("/invoices");
        return;
      }
      form.reset();
      invoice.items.forEach((item) => {
        append(JSON.parse(item));
      });
      form.setValue("customerId", invoice.customer?.$id);
      form.setValue("total", invoice?.total);
      form.setValue("paymentMethod", invoice?.paymentMethod);
    }
  }, [type, invoiceId, invoices, isHydrated]);

  useEffect(() => {
    let total = 0;
    watchedItems.forEach((_, index) => {
      total +=
        parseInt(form.getValues(`items.${index}.quantity`)) *
        form.getValues(`items.${index}.amount`);
    });

    form.setValue("total", total);
  }, [JSON.stringify(watchedItems)]);

  const handleAddItem = () => {
    append({ productId: "", quantity: "1", amount: 0 });
  };

  const handleSubmit = async (values: CreateInvoiceSchemaType) => {
    let isValidQuantity = true;
    values.items.forEach(({ productId, quantity }, index) => {
      const stock = products.find(({ $id }) => $id === productId)?.stock;
      if (stock < quantity) {
        form.setError(`items.${index}.quantity`, {
          message: `Max quantity available: ${stock}`,
        });
        isValidQuantity = false;
      }
    });
    if (!isValidQuantity) return;

    const loadingToast = toast.loading(
      type === "create" ? "Creating Invoice..." : "Updating Invoice...",
      { duration: Infinity },
    );

    setIsLoading(true);
    let result;

    if (type === "create") {
      result = await insertInvoice(values);
    } else if (type === "update" && invoiceId) {
      result = await updateInvoice(invoiceId, values);
    }

    toast.dismiss(loadingToast);
    const msg = `🧾New Invoice Generated\n\n**Total Amount:** ${result?.data?.total}\n\n**Payment Method:** ${result?.data?.paymentMethod}\n\n**Customer Name:** ${result?.data?.customer?.name}\n`;
    const reply_markup = {
      inline_keyboard: [
        [
          {
            text: "View Receipt",
            url: `${invoiceReceiptUrlPrefix}/${result.data.$id}`,
          },
        ],
      ],
    };
    await sendTelegramMessage(msg, reply_markup);
    if (result?.success) {
      toast.success(
        type === "create"
          ? "Invoice Added Successfully"
          : "Invoice Updated Successfully",
      );

      if (type === "create" && result.data) {
        addInvoice(result.data);
      } else if (type === "update" && result.data) {
        updateInvoiceState(result.data);
      }

      const updatedProducts = products.map((product) => {
        const item = values.items.find(
          ({ productId }) => productId === product.$id,
        );
        if (item) {
          const deductedStock = product.stock - parseInt(item.quantity);
          let headingMsg;
          let isSendMsg = false;
          if (deductedStock == 0) {
            headingMsg = `⚠️ Out of Stock Alert`;
            isSendMsg = true;
          } else if (deductedStock < 5) {
            headingMsg = `⚠️ Low Stock Alert`;
            isSendMsg = true;
          }

          if (isSendMsg) {
            const msg = `${headingMsg}\n\n**Product: ** ${product.name}\n\n**Stock Left: ** ${deductedStock}`;
            const reply_markup = {
              inline_keyboard: [
                [
                  {
                    text: "Update Stock",
                    url: `https://bill-mart.vercel.app/products/edit/${product.$id}`,
                  },
                ],
              ],
            };
            sendTelegramMessage(msg, reply_markup);
          }

          return {
            ...product,
            stock: deductedStock,
          };
        }
        return product;
      });
      setProducts(updatedProducts);

      router.replace("/invoices");
    } else {
      toast.error(
        type === "create"
          ? "Failed to add Invoice"
          : "Failed to update Invoice",
      );
    }

    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    const customer = customers.find(
      ({ $id }) => $id === form.getValues("customerId"),
    );
    if (!customer?.email) return toast.error("Customer email not found");
    const loadingToast = toast.loading("Sending Otp...");
    setIsLoading(true);
    try {
      const res = await sendOtpEmail(customer.email);

      if (res?.success) {
        toast.success("Otp sent successfully");
        setIsOtpSent(true);
        return;
      }
      toast.error("Failed to send otp. Please try resending again");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send otp. Please try resending again");
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  const handleOnverifyOtp = () => {
    const customer = customers.find(
      ({ $id }) => $id === form.getValues("customerId"),
    );
    if (!customer?.email) return toast.error("Customer email not found");
    setIsOtpVerified(true);
  };

  if (!isHydrated) return <CustomLoader />;

  return (
    <Form {...form}>
      <Card className="mx-auto w-full rounded-2xl shadow-none border-0">
        <BackBtn />
        <CardHeader>
          <CardTitle className="text-2xl">
            {type === "create" ? "Add Invoice" : "Edit Invoice"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <SelectWithSearch
              items={customers}
              control={form.control}
              placeholder="Select Customer"
              notFoundText="No Customer Found"
              bind_label="name"
              bind_value="$id"
              searchText="Search Customers..."
              name="customerId"
              label="Select Customer"
              onSelectChange={(value) => form.setValue("customerId", value)}
            />

            {fields.map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-4 max-sm:flex-wrap"
              >
                <SelectWithSearch
                  items={products}
                  control={form.control}
                  placeholder="Select Product"
                  notFoundText="No Product Found"
                  bind_label="name"
                  bind_value="$id"
                  searchText="Search Products..."
                  name={`items.${index}.productId`}
                  label="Select Product"
                  onSelectChange={(value) => {
                    form.setValue(`items.${index}.productId`, value);
                    form.setValue(
                      `items.${index}.amount`,
                      products.find(({ $id }) => $id === value)?.price || 0,
                    );
                  }}
                />
                <CustomInput
                  type="number"
                  placeholder="Enter Quantity"
                  control={form.control}
                  name={`items.${index}.quantity`}
                  label={`Item Quantity | Stock: ${
                    products.find(
                      ({ $id }) =>
                        $id === form.getValues(`items.${index}.productId`),
                    )?.stock ?? "0"
                  }`}
                />
                <CustomInput
                  type="number"
                  placeholder="Enter Product Pricea "
                  control={form.control}
                  name={`items.${index}.amount`}
                  label="Product Price"
                  disabled
                />
                {index === fields.length - 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddItem}
                    className="mt-auto"
                  >
                    <Plus />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-auto border-destructive text-destructive"
                    onClick={() => remove(index)}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            ))}

            <CustomInput
              readOnly
              disabled
              placeholder="Total Amount"
              control={form.control}
              name="total"
              label="Total Amount"
            />
            <Separator />
            <Label>Payment Method</Label>
            <div className="flex items-center gap-2">
              {["CASH", "CARD", "UPI"].map((method: any) => (
                <Button
                  key={method}
                  type="button"
                  variant="outline"
                  className={cn(
                    form.watch("paymentMethod") === method &&
                      "border-primary text-primary",
                  )}
                  onClick={() => form.setValue("paymentMethod", method)}
                >
                  {method}
                </Button>
              ))}
            </div>
            {isOtpSent && (
              <>
                <Separator />
                <VerifyOtpForm
                  email={
                    customers.find(
                      ({ $id }) => $id === form.getValues("customerId"),
                    )?.email || ""
                  }
                  onVerify={handleOnverifyOtp}
                />
              </>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-[100px]"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              {isOtpVerified ? (
                <Button
                  type="submit"
                  className="w-[100px]"
                  disabled={isLoading}
                >
                  {type === "create" ? "Create" : "Update"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !form.getValues("customerId")}
                >
                  {isOtpSent ? "Resend Otp" : "Send Otp"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

const VerifyOtpForm = ({ email, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setisVerified] = useState(false);

  const otpVerify = async () => {
    setIsVerifying(true);

    try {
      const isVerified = await verifyOtp(email, otp);
      if (isVerified?.success) {
        setIsVerifying(false);
        setisVerified(true);
        toast.success("Otp Verified Successfully");
        onVerify();
        return;
      }
      toast.error(isVerified?.message || "Invalid Otp. Please try again");
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <>
      <Label>OTP Verification</Label>
      <div>
        <CustomInput
          inputOnly
          placeholder="Enter OTP"
          onChange={(data) => {
            console.log(data);
            setOtp(data);
          }}
          name="otp"
          label="Enter OTP"
          value={otp}
          type="number"
          disabled={isVerifying}
        />
        <div className="text-xs text-green-500">
          {isVerified && "OTP Verified successfully"}
        </div>
      </div>
      {!isVerified && (
        <Button onClick={otpVerify} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </Button>
      )}
    </>
  );
};
