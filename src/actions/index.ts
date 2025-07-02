"use server";

import { createSessionClient } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category.schema";
import {
  CreateCustomerSchema,
  CreateCustomerSchemaType,
} from "@/schema/customer.schema";
import {
  CreateInvoiceSchema,
  CreateInvoiceSchemaType,
} from "@/schema/invoices.schema";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product.schema";
import { ID, Query } from "node-appwrite";

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

export async function getProducts() {
  try {
    const { databases } = await createSessionClient();
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      [Query.orderDesc("$createdAt")],
    );

    return products;
  } catch {
    return { documents: [], total: 0 };
  }
}

export async function insertProduct(values: CreateProductSchemaType) {
  const parsedBody = CreateProductSchema.safeParse(values);

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

export async function getCategories() {
  try {
    const { databases } = await createSessionClient();
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      [Query.orderDesc("name")],
    );
    return categories;
  } catch {
    return { documents: [], total: 0 };
  }
}
export async function insertCategory(values: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const { name } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();
    const data = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      ID.unique(),
      {
        name,
      },
    );
    return {
      success: true,
      message: "Category inserted successfully",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to insert Category",
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
      [Query.orderDesc("$createdAt")],
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
    const Invoices = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      [Query.orderDesc("$createdAt")],
    );
    return Invoices;
  } catch {
    return { documents: [], total: 0 };
  }
}
export async function insertInvoice(values: CreateInvoiceSchemaType) {
  const parsedBody = CreateInvoiceSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const { name } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();
    const data = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.invoicesCollectionId,
      ID.unique(),
      {
        name,
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
