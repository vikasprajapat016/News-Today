import { ID } from "appwrite"
import { appwriteConfig, storage } from "./config"

// upload file to Appwrite bucket
export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )
    return uploadedFile
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}

// get public file download URL
export async function getFileURL(fileId) {
  if (!fileId) throw new Error("Missing fileId for getFileURL")
  try {
    const response = storage.getFileDownload(appwriteConfig.storageId, fileId)
    return response.href || response.toString()
  } catch (error) {
    console.error("Error getting file URL:", error)
    throw error
  }
}
