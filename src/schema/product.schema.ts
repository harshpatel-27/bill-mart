import * as z from "zod";

export const ProductSchema = z.object({
  category: z.string().min(1, { message: "Please enter category of product" }),
  name: z.string().min(1, { message: "Please enter name of product" }),
  price: z
    .string()
    .min(1, { message: "Price is required and must be greater than 0." }),
  stock: z.string().optional(),
});
export type ProductSchemaType = z.infer<typeof ProductSchema>;
