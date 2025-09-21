"use server";

import { createSessionClient } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import { CategorySchema, CategorySchemaType } from "@/schema/category.schema";
import {
  CreateCustomerSchema,
  CreateCustomerSchemaType,
} from "@/schema/customer.schema";
import {
  CreateInvoiceSchema,
  CreateInvoiceSchemaType,
} from "@/schema/invoices.schema";
import { ProductSchema, ProductSchemaType } from "@/schema/product.schema";
import { ID, Query } from "node-appwrite";
import nodemailer from "nodemailer";
import { convertImgLink, generateOTP } from "@/lib/utils";

export async function getProducts() {
  try {
    const { databases } = await createSessionClient();
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      [
        Query.select(["category.name", "name", "price", "stock"]),
        Query.orderDesc("$createdAt"),
      ],
    );

    return products;
  } catch {
    return { documents: [], total: 0 };
  }
}
export async function insertProduct(values: ProductSchemaType) {
  const parsedBody = ProductSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const { name, price, stock, category } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();
    const createdEmployee = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      ID.unique(),
      {
        name,
        category,
        price: parseInt(price),
        stock: parseInt(stock || ""),
      },
    );
    return {
      success: true,
      message: "Product inserted successfully",
      data: createdEmployee,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to insert Product",
      error: error.message!,
    };
  }
}
export async function updateProduct(
  productId: string,
  values: ProductSchemaType,
) {
  const parsedBody = ProductSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { name, price, stock, category } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();

    const updatedProduct = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      productId,
      {
        name,
        category,
        price: parseInt(price),
        stock: parseInt(stock || ""),
      },
    );

    return {
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update product",
      error: error.message!,
    };
  }
}

export async function updateProductStock(id: string, quantity: string) {
  try {
    const { databases } = await createSessionClient();

    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
    );
    const currentQty = product.stock;
    if (currentQty < quantity) {
      return { success: false, notEnoughStock: true };
    }
    const newQty = currentQty - parseInt(quantity);
    const updatedProduct = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
      {
        stock: newQty,
      },
    );

    return {
      success: true,
      data: updatedProduct,
      message: "Stock Updated successfully",
    };
  } catch {
    return { success: false, productId: id };
  }
}
export async function deleteProduct(id: string) {
  try {
    const { databases } = await createSessionClient();
    const data = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
    );

    return {
      success: true,
      data,
      message: "Product Deleted successfully",
    };
  } catch {
    return { success: false };
  }
}

export async function getCategories() {
  try {
    const { databases } = await createSessionClient();
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      [
        Query.orderDesc("name"),
        Query.select(["name"]),
        Query.select(["imageId"]),
      ],
    );
    return categories;
  } catch {
    return { documents: [], total: 0 };
  }
}
export async function insertCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const image = formData.get("image") as File | null;

  if (!name) {
    throw new Error("Name is required");
  }
  let fileId = "";
  if (image) {
    const uploadResult = await uploadImage(image);
    if (!uploadResult.success) {
      throw new Error("Image upload failed: " + uploadResult.error);
    }
    fileId = uploadResult.fileId || "";
  }

  try {
    const { databases } = await createSessionClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      ID.unique(),
      {
        name,
        imageId: fileId,
      },
    );
    return {
      success: true,
      message: "Category inserted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to insert Category",
      error: error.message!,
    };
  }
}
export async function updateCategory(categoryId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const image = formData.get("image") as File | null;
  const imageId = formData.get("imageId") as string | null;
  let newImageId = imageId;
  if (!name) {
    throw new Error("Name is required");
  }

  if (image) {
    const uploadResult = await uploadImage(image);
    if (!uploadResult || !uploadResult.success) {
      throw new Error("Image upload failed: " + uploadResult.error);
    }
    if (imageId) await deleteImage(imageId);
    newImageId = uploadResult.fileId || "";
  }

  try {
    const { databases } = await createSessionClient();

    const updatedCategory = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      categoryId,
      {
        name,
        imageId: newImageId,
      },
    );

    return {
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update Category",
      error: error.message!,
    };
  }
}
export async function deleteCategory(id: string) {
  try {
    const { databases } = await createSessionClient();
    const data = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      id,
    );

    console.log({ data });

    return {
      success: true,
      data,
      message: "Category Deleted successfully",
    };
  } catch {
    return { success: false, message: "Failed to delete category" };
  }
}

export async function getCustomers() {
  try {
    const { databases } = await createSessionClient();
    const customers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.customersCollectionId,
      [Query.orderDesc("$createdAt"), Query.select(["name", "phone", "email"])],
    );
    return customers;
  } catch {
    return { documents: [], total: 0 };
  }
}
export async function insertCustomer(values: CreateCustomerSchemaType) {
  const parsedBody = CreateCustomerSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const { name, email, phone } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();
    const data = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customersCollectionId,
      ID.unique(),
      {
        name,
        email,
        phone,
      },
    );
    return {
      success: true,
      message: "Customer inserted successfully",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to insert Customer",
      error: error.message!,
    };
  }
}
export async function updateCustomer(
  customerId: string,
  values: CreateCustomerSchemaType,
) {
  const parsedBody = CreateCustomerSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { name, email, phone } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();

    const updatedCustomer = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customersCollectionId,
      customerId,
      {
        name,
        email,
        phone,
      },
    );

    return {
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update Customer",
      error: error.message!,
    };
  }
}
export async function deleteCustomer(id: string) {
  try {
    const { databases } = await createSessionClient();
    const data = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customersCollectionId,
      id,
    );

    return {
      success: true,
      data,
      message: "Customer Deleted successfully",
    };
  } catch {
    return { success: false, message: "Failed to delete Customer" };
  }
}

export async function getInvoices() {
  try {
    const { databases } = await createSessionClient();
    const invoices = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      [
        Query.orderDesc("$createdAt"),
        Query.select([
          "customer.name",
          "customer.phone",
          "items",
          "total",
          "paymentMethod",
        ]),
      ],
    );
    return invoices;
  } catch {
    return { documents: [], total: 0 };
  }
}

export async function getInvoice(id: string) {
  try {
    const { databases } = await createSessionClient();
    const invoice = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      id,
    );
    return { success: true, data: invoice };
  } catch {
    return { success: false, data: [] };
  }
}

export async function insertInvoice(values: CreateInvoiceSchemaType) {
  const parsedBody = CreateInvoiceSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const { customerId, items, paymentMethod, total } = parsedBody.data;
  console.log({ items });

  await Promise.all(
    items.map(async ({ productId, quantity }) => {
      try {
        await updateProductStock(productId, quantity);
      } catch {
        // return { productId, msg: "Error while updating stock" };
      }
    }),
  );

  const stringiFiedItems = items.map((item) => JSON.stringify(item));

  try {
    const { databases } = await createSessionClient();
    const data = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      ID.unique(),
      {
        customer: customerId,
        paymentMethod,
        total,
        items: stringiFiedItems,
      },
    );
    return {
      success: true,
      message: "Invoice inserted successfully",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to insert Invoice",
      error: error.message!,
    };
  }
}

export async function updateInvoice(
  id: string,
  values: CreateInvoiceSchemaType,
) {
  const parsedBody = CreateInvoiceSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { customerId, items, paymentMethod, total } = parsedBody.data;

  // Update stock for each product
  await Promise.all(
    items.map(async ({ productId, quantity }) => {
      try {
        await updateProductStock(productId, quantity); // optional: manage rollback if needed
      } catch {
        // silent fail or handle per product if needed
      }
    }),
  );

  const stringiFiedItems = items.map((item) => JSON.stringify(item));

  try {
    const { databases } = await createSessionClient();
    const data = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      id,
      {
        customer: customerId,
        paymentMethod,
        total,
        items: stringiFiedItems,
      },
    );

    return {
      success: true,
      message: "Invoice updated successfully",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update Invoice",
      error: error.message!,
    };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const { databases } = await createSessionClient();
    const data = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      id,
    );

    return {
      success: true,
      data,
      message: "Invoice Deleted successfully",
    };
  } catch {
    return { success: false, message: "Failed to delete Invoice" };
  }
}

export async function getStats() {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(today.getMonth() - 11);
    const { databases } = await createSessionClient();

    const invoices = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      [
        Query.orderDesc("$createdAt"),
        Query.select(["customer.name", "items", "total", "paymentMethod"]),
      ],
    );
    let totalQuantitySold = 0;
    const totalInvoices = invoices.total;
    const totalRevenue =
      "₹" + invoices.documents.reduce((acc, doc) => acc + (doc.total || 0), 0);
    const paymentMethodStats = { CASH: 0, CARD: 0, UPI: 0 };
    const monthlyStats: Record<string, { total: number; quantity: number }> =
      {};

    invoices.documents.forEach((doc) => {
      if (
        doc.paymentMethod &&
        paymentMethodStats[doc.paymentMethod] !== undefined
      ) {
        paymentMethodStats[doc.paymentMethod] += doc?.total;
      }

      if (doc.items && Array.isArray(doc.items)) {
        doc.items.forEach((itemStr: string) => {
          try {
            const item = JSON.parse(itemStr);
            totalQuantitySold += Number(item.quantity) || 0;
          } catch (e) {
            console.error("Invalid item JSON:", itemStr);
          }
        });
      }

      const d = new Date(doc.$updatedAt);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { total: 0, quantity: 0 };
      }

      monthlyStats[monthKey].total += Number(doc.total) || 0;

      if (doc.items && Array.isArray(doc.items)) {
        doc.items.forEach((itemStr: string) => {
          try {
            const item = JSON.parse(itemStr);
            monthlyStats[monthKey].quantity += Number(item.quantity) || 0;
          } catch (e) {
            console.error("Invalid item JSON:", itemStr);
          }
        });
      }
    });

    const monthlyRevenueData: {
      month: string;
      total: number;
      quantity: number;
    }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
      monthlyRevenueData.push({
        month: key,
        total: monthlyStats[key]?.total ?? 0,
        quantity: monthlyStats[key]?.quantity ?? 0,
      });
    }

    return {
      totalRevenue,
      totalInvoices,
      paymentMethodStats,
      totalQuantitySold,
      monthlyRevenueData,
    };
  } catch (e) {
    console.log({ error: e });
    return { error: JSON.stringify(e), documents: [], total: 0 };
  }
}

export async function sendOtpEmail(email: string) {
  try {
    const { databases } = await createSessionClient();
    const otp = generateOTP(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const data = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.otpCollectionId,
      ID.unique(),
      {
        email,
        otp,
        expiresAt,
      },
    );
    if (!data) return { success: false, error: "Failed to send OTP" };

    const htmlTemplate = `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:24px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(15,23,42,0.06);">
          <tr>
            <td style="padding:28px 32px 16px 32px;text-align:left;">
              <h1 style="margin:0;font-size:20px;color:#0f172a;">Your verification code</h1>
              <p style="margin:8px 0 0 0;color:#475569;font-size:14px;line-height:1.4;">
                Use the one-time password (OTP) below to complete your action.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:12px 32px 20px 32px;">
              <div style="display:inline-block;background:#f8fafc;border:1px solid #e6eef8;border-radius:8px;padding:18px 22px;">
                <p style="margin:0;text-align:center;font-size:28px;letter-spacing:3px;font-weight:700;color:#0b1220;font-family:monospace;">
                  ${otp}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 20px 32px;text-align:left;">
              <p style="margin:0;color:#334155;font-size:14px;line-height:1.4;">
                This code will <strong>expire in 5 minutes</strong>. If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 28px 32px;text-align:left;border-top:1px solid #eef2f7;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                This email is intended for the recipient only. For security, do not share your OTP.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 32px 34px 32px;text-align:center;font-size:12px;color:#94a3b8;">
              © BillMart, All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;

    // const isSentOtp = await resend.emails.send({
    //   from: "BillMart <onboarding@resend.dev>",
    //   to: email,
    //   subject: `${otp} is your BillMart invoice otp`,
    //   html: htmlTemplate,
    // });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Gmail address
        pass: process.env.GMAIL_PASS, // App password
      },
    });

    const isSentOtp = await transporter.sendMail({
      from: `"BillMart" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `${otp} is your BillMart invoice otp`,
      html: htmlTemplate,
    });
    if (!isSentOtp) return { success: false, error: "Failed to send OTP" };
    console.log({ isSentOtp });
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: "Failed to send OTP" };
  }
}

export async function verifyOtp(email: string, userOtp: string) {
  try {
    const { databases } = await createSessionClient();
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.otpCollectionId,
      [
        Query.equal("email", email),
        Query.equal("otp", userOtp),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ],
    );

    if (result.total === 0) {
      return { success: false, message: "Invalid OTP" };
    }

    const otpDoc = result.documents[0];
    const now = new Date();

    if (new Date(otpDoc.expiresAt) < now) {
      return { success: false, message: "OTP expired" };
    }

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Failed to verify OTP" };
  }
}

export async function uploadImage(file: File) {
  try {
    const { storage } = await createSessionClient();
    const uploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      "unique()",
      file,
    );
    const fileUrl = convertImgLink(uploaded.$id);

    return { success: true, url: fileUrl, fileId: uploaded.$id };
  } catch (error: any) {
    console.error("Upload failed:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteImage(id: string) {
  try {
    const { storage } = await createSessionClient();
    await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!, id);

    return { success: true };
  } catch (error: any) {
    console.error("Delete failed:", error.message);
    return { success: false, error: error.message };
  }
}
