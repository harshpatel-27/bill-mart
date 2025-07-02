import * as z from "zod";

export const CreateInvoiceSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});
export type CreateInvoiceSchemaType = z.infer<typeof CreateInvoiceSchema>;
