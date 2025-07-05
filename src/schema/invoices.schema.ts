import * as z from "zod";
const itemSchema = z.object({
  productId: z.string(),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  amount: z.number().nonnegative(),
});

export const CreateInvoiceSchema = z.object({
  customerId: z.string().min(1, { message: "Customer is required" }),
  items: z.array(itemSchema).min(1),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["CASH", "UPI", "CARD"]).default("CASH"),
});
export type CreateInvoiceSchemaType = z.infer<typeof CreateInvoiceSchema>;
