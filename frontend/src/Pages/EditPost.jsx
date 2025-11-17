import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"
import ReactQuill from "react-quill-new"
import "react-quill-new/dist/quill.snow.css"
import { getFileURL, uploadFile } from "@/lib/appwrite/uploadImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useSelector } from "react-redux"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const baseURL = import.meta.env.VITE_API_URL || "";


const EditPost = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  // States
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageURL, setImageURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔹 Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/post/getposts?postId=${postId}`)
        const data = res.data.posts?.[0]
        if (data) {
          setTitle(data.title)
          setCategory(data.category)
          setContent(data.content)
          setImageURL(data.image)
          setImagePreview(data.image)
        }
      } catch (error) {
        console.error("Error fetching post:", error)
        toast.error("Failed to load post details")
      }
    }
    fetchPost()
  }, [postId])

  // 🔹 Handle file selection
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

  // 🔹 Handle image upload
  const handleUploadImage = async () => {
    if (!imageFile) {
      toast.error("Please select an image to upload")
      return
    }

    try {
      setUploading(true)
      const uploadedFile = await uploadFile(imageFile)
      if (!uploadedFile?.$id) throw new Error("Upload failed — missing file ID")

      const url = await getFileURL(uploadedFile.$id)
      setImageURL(url)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Image upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  // 🔹 Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !content) {
      toast.error("Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      const updatedData = {
        title,
        category,
        content,
        image: imageURL,
      }

      const res = await axios.put(
        `${baseURL}/api/post/updatepost/${postId}/${currentUser._id}`,
        updatedData,
        { withCredentials: true }
      )

      toast.success(res.data?.message || "Post updated successfully!")
      navigate(`/post/${res.data.slug || postId}`)
    } catch (error) {
      console.error(error.response?.data || error)
      toast.error(error.response?.data?.message || "Failed to update post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Edit your post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title + Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full sm:w-3/4 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Select value={category} onValueChange={setCategory}>
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

        {/* Image Upload */}
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

        {/* Content Editor */}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Update your article..."
          className="h-72 mb-12"
          required
        />

        {/* Submit */}
        <Button
          type="submit"
          className="h-12 bg-green-600 font-semibold max-sm:mt-5 text-md"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Your Article"}
        </Button>
      </form>
    </div>
  )
}

export default EditPost
