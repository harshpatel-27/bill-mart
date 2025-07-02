"use server";

import { createSessionClient } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/category.schema";
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
    return null;
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
