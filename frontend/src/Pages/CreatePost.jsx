import React, { useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import { getFileURL, uploadFile } from "@/lib/appwrite/uploadImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const baseURL =
  import.meta.env.MODE === "development" ? "/api" : import.meta.env.VITE_API_URL


const CreatePost = () => {
  const navigate = useNavigate()

  // States
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageURL, setImageURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const previewURL = URL.createObjectURL(file)
      setImagePreview(previewURL)
    } else {
      setImageFile(null)
      setImagePreview(null)
    }
  }

  // Handle image upload to Appwrite
// Handle image upload to Appwrite
const handleUploadImage = async () => {
  if (!imageFile) {
    toast.error("Please select an image to upload")
    return
  }

  try {
    setUploading(true)

    // 1️⃣ Upload to Appwrite bucket
    const uploadedFile = await uploadFile(imageFile)
    if (!uploadedFile?.$id) {
      throw new Error("Upload failed — missing file ID")
    }

    // 2️⃣ Get public URL (await because it's async)
    const url = await getFileURL(uploadedFile.$id)
    console.log("✅ File URL:", url)

    // 3️⃣ Save in state
    setImageURL(url)

    toast.success("Image uploaded successfully!")
  } catch (error) {
    console.error("Image upload error:", error)
    toast.error("Failed to upload image")
  } finally {
    setUploading(false)
  }
}



  // Handle submit post
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !content) {
      toast.error("Please fill all required fields")
      return
    }

    if (!imageURL) {
      toast.error("Please upload an image first")
      return
    }

    setLoading(true)
    try {
      const postData = {
        title,
        category,
        content,
        image: imageURL,
      }

      const res = await axios.post(
        `${baseURL}/post/create`,
        postData,
        { withCredentials: true }
      )

      toast.success(res.data?.message || "Post published successfully!")

      // Reset form
      setTitle("")
      setCategory("")
      setContent("")
      setImageFile(null)
      setImagePreview(null)
      setImageURL("")

      navigate("/posts")
    } catch (error) {
      console.error(error.response?.data || error)
      toast.error(error.response?.data?.message || "Failed to publish post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Create a post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title and Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full sm:w-3/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Select onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
                <SelectItem value="entertainment">Entertainment News</SelectItem>

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col gap-2 border-4 border-slate-600 border-dotted p-3 rounded-2xl">
          <div className="flex gap-4 items-center justify-between">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
            <Button
              type="button"
              className="bg-slate-700"
              onClick={handleUploadImage}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected"
              className="max-h-48 border border-slate-400 mt-2 rounded-xl object-cover"
            />
          )}
        </div>

        {/* React Quill Editor */}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Write something interesting..."
          className="h-72 mb-12"
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 bg-green-600 font-semibold max-sm:mt-5 text-md"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Your Article"}
        </Button>
      </form>
    </div>
  )
}

export default CreatePost
