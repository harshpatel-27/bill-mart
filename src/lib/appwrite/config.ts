export const appwriteConfig = {
  url: process.env.NEXT_PUBLIC_APPWRITE_URL!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  productsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
  categoriesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
  customersCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!,
  invoicesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID!,
  apiSecret: process.env.NEXT_APPWRITE_API_SECRET!,
};
