import * as z from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid file type",
    })
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
      message: "Image must be less than 10MB",
    })
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(
          file.type,
        ),
      { message: "Only .jpg, .png, .svg formats are supported" },
    ),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
