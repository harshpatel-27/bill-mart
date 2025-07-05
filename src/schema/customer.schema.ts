import * as z from "zod";

export const CreateCustomerSchema = z.object({
  name: z.string().min(1, { message: "Customer name is required" }),
  email: z.string().email().min(1, { message: "Customer email is required" }),
  phone: z.string().min(1, { message: "Customer mobile number is required" }),
});
export type CreateCustomerSchemaType = z.infer<typeof CreateCustomerSchema>;
