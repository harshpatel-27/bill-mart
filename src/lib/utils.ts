import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { appwriteConfig } from "./appwrite/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function base64ToImageFile(base64String: string, fileName: string) {
  // Split the base64 string to get the data type and the actual data
  const [header, data] = base64String.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeString = mimeMatch ? mimeMatch[1] : ""; // Extract the mime type
  const byteString = atob(data); // Decode base64 string
  const ab = new Uint8Array(byteString.length);

  // Create a binary array from the decoded string
  for (let i = 0; i < byteString.length; i++) {
    ab[i] = byteString.charCodeAt(i);
  }

  // Create a Blob from the binary array
  const blob = new Blob([ab], { type: mimeString });

  // Create a File from the Blob
  const imageFile = new File([blob], fileName, { type: blob.type });

  return imageFile; // Return the created File object
}

export function convertStringToFileName(value: string) {
  if (!value.trim() || value == "" || value == null) return Date.now();
  return value?.toLowerCase()?.split(" ")?.join("-");
}

export const formatProduct = (data) => {
  if (!data || data.length == 0) return;
  return data.map((singleProduct) => {
    const newStockArr = singleProduct?.stockTransactions.map((ele) => {
      const newCustomFieldsArr = ele.custom_fields.map((elem) =>
        JSON.parse(elem),
      );
      return {
        ...ele,
        custom_fields: newCustomFieldsArr,
      };
    });

    const resultMap = new Map<
      string,
      { custom_fields: any[]; total: number }
    >();

    for (const txn of newStockArr) {
      const key = JSON.stringify(txn.custom_fields);
      const change = txn.type === "IN" ? txn.no_of_items : -txn.no_of_items;

      if (resultMap.has(key)) {
        resultMap.get(key)!.total += change;
      } else {
        resultMap.set(key, {
          custom_fields: txn.custom_fields,
          total: change,
        });
      }
    }

    const individualFieldStockData = Array.from(resultMap.values());

    return {
      ...singleProduct,
      individualFieldStockData,
    };
  });
};
