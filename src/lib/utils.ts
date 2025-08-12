import { logOutCurrentUser } from "@/actions/user";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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

export const checkPathnames = (pathname, paths: string[]): boolean => {
  if (!pathname) return false;
  return paths.some((path) => {
    return pathname.includes(path);
  });
};

export const logoutUser = async () => {
  const loggedOut = await logOutCurrentUser();
  if (loggedOut?.success) {
    toast.success("You have been logged out successfully.");
    // Redirect to sign-in page after successful logout
    window.location.href = "/sign-in";
  } else {
    toast.error("Failed to log out. Please try again.");
    console.error("Logout failed");
  }
};
