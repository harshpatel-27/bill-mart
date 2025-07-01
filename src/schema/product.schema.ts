import * as z from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, { message: "Please enter name of product" }),
  custom_fields: z.array(z.string()),
});
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
