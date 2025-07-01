export const appwriteConfig = {
  url: process.env.NEXT_PUBLIC_APPWRITE_URL!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  stockTransactionCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_STOCK_TRANSACTIONS_COLLECTION_ID!,
  productsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
  apiSecret: process.env.NEXT_APPWRITE_API_SECRET!,
};
