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
      [Query.orderDesc("name"), Query.select(["name"])],
    );
    return categories;
  } catch {
    return { documents: [], total: 0 };
  }
}
export async function insertCategory(values: CategorySchemaType) {
  const parsedBody = CategorySchema.safeParse(values);

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
export async function updateCategory(
  categoryId: string,
  values: CategorySchemaType,
) {
  const parsedBody = CategorySchema.safeParse(values);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const { name } = parsedBody.data;

  try {
    const { databases } = await createSessionClient();

    const updatedCategory = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      categoryId,
      {
        name,
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
