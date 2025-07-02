import * as z from "zod";

export const CreateStockTransactionSchema = z.object({
  product: z.string().min(1, { message: "Please select a product" }),
  type: z.enum(["IN", "OUT"]),
  no_of_items: z
    .number()
    .min(1, { message: "Quantity must be equal to or greater than 1." }),
  remarks: z.string().max(500, { message: "Max 500 characters." }),
  transaction_date: z.coerce.date(),
  custom_fields: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
    }),
  ),
});
export type CreateStockTransactionType = z.infer<
  typeof CreateStockTransactionSchema
>;
