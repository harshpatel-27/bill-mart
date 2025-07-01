"use server";

import { createSessionClient } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product.schema";
import {
  CreateStockTransactionSchema,
  CreateStockTransactionType,
} from "@/schema/stocks.schema";
import { ID, Models, Query } from "node-appwrite";

// export async function getStockTransactions() {
//   try {
//     const { databases } = await createSessionClient();
//     const stockTransactions = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.stockTransactionCollectionId,
//       [Query.isNotNull("product")],
//     );

//     return stockTransactions;
//   } catch {
//     return { documents: [], total: 0 };
//   }
// }

export async function getStockTransactions() {
  const allDocuments = <Array<Models.Document>>[];
  const limit = 100; // max allowed by Appwrite
  let offset = 0;
  let hasMore = true;

  try {
    const { databases } = await createSessionClient();

    while (hasMore) {
      const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.stockTransactionCollectionId,
        [Query.isNotNull("product"), Query.limit(limit), Query.offset(offset)],
      );

      allDocuments.push(...result.documents);

      offset += result.documents.length;
      hasMore = result.documents.length === limit;
    }

    return { documents: allDocuments, total: allDocuments.length };
  } catch {
    return { documents: [], total: 0 };
  }
}

export async function getStockTransaction(id: string) {
  try {
    const { databases } = await createSessionClient();
    const stock = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.stockTransactionCollectionId,
      id,
    );

    return stock;
  } catch {
    return null;
  }
}

export async function deleteStockTransaction(id: string) {
  try {
    const { databases } = await createSessionClient();
    const deletedRecord = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.stockTransactionCollectionId,
      id,
    );

    return {
      success: true,
      deletedRecord,
      message: "Record Deleted successfully",
    };
  } catch {
    return null;
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
    return null;
  }
}

export async function createStockTransaction(
  values: CreateStockTransactionType,
) {
  const parsedBody = CreateStockTransactionSchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const {
    no_of_items,
    product,
    remarks,
    transaction_date,
    type,
    custom_fields,
  } = parsedBody.data;

  const customFieldsArr = custom_fields.map((ele) => JSON.stringify(ele));

  try {
    const { databases } = await createSessionClient();
    const createdEmployee = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.stockTransactionCollectionId,
      ID.unique(),
      {
        no_of_items,
        product,
        remarks,
        transaction_date,
        type,
        custom_fields: customFieldsArr,
      },
    );
    return {
      success: true,
      message: "Employee created successfully",
      data: createdEmployee,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to create Employee",
      error: error.message!,
    };
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
  const { name, custom_fields } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();
    const createdEmployee = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      ID.unique(),
      {
        name,
        custom_fields,
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
