import * as z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});
export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
