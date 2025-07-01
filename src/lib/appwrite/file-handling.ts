// import {ID} from "node-appwrite";
// import {createSessionClient} from "./api";
// import {appwriteConfig} from "./config";

// export const handleFileUpload = async (file) => {
//   if (!file) return;
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const response = await fetch("/api/file-upload", {
//       method: "POST",
//       body: formData,
//     });
//     if (response.ok) {
//       const responseData = await response.json(); // Parse the response data as JSON
//       return responseData?.data;
//     }
//   } catch (error) {
//     console.error("Error uploading file", error);
//   }
// };

// export const handleFileDelete = async (fileId) => {
//   if (!fileId) return;
//   const formData = new FormData();
//   formData.append("fileId", fileId);

//   try {
//     const response = await fetch("/api/delete-file", {
//       method: "POST",
//       body: formData,
//     });
//     if (response.ok) {
//       const responseData = await response.json(); // Parse the response data as JSON
//       return responseData;
//     } else {
//     }
//   } catch (error) {
//     console.error("Error uploading file", error);
//   }
// };
