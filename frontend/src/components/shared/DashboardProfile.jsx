import React, { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,

  updateFailure,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice"
import { uploadFile, getFileURL } from "@/lib/appwrite/uploadImage"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

const baseURL =
  import.meta.env.MODE === "development" ? "/api" : import.meta.env.VITE_API_URL


const DashboardProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const profilePicRef = useRef()

  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [formData, setFormData] = useState({})

  // 🖼️ handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  // ✏️ handle input text changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // 📤 upload image to Appwrite
  const uploadImage = async () => {
    if (!imageFile) return currentUser.profilePicture

    try {
      const uploadedFile = await uploadFile(imageFile)
      console.log("Uploaded file:", uploadedFile)

      const fileUrl = getFileURL(uploadedFile.$id)
      console.log("File download URL:", fileUrl)

      return fileUrl
    } catch (error) {
      console.error("Image upload failed:", error)
      toast.error("Image upload failed. Please try again!")
      return currentUser.profilePicture
    }
  }

  // 💾 handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateStart())

      const profilePicture = await uploadImage()

      const updateProfile = {
        ...formData,
        profilePicture,
      }

      console.log("Update data:", updateProfile)

      const res = await fetch(`${baseURL}/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateProfile),
      })

      // ✅ check HTTP status
      if (!res.ok) {
        const errorData = await res.json()
        toast.error(errorData.message || "Update failed")
        dispatch(updateFailure(errorData.message || "Update failed"))
        return
      }

      const data = await res.json()
      dispatch(updateSuccess(data))
      toast.success("User updated successfully!")
    } catch (error) {
      console.error("Update failed:", error)
      toast.error("Update user failed. Please try again!")
      dispatch(updateFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())

      const res = await fetch(`${baseURL}/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else {
        dispatch(deleteUserSuccess())
      }
    } catch (error) {
      console.log(error)
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch(`${baseURL}/user/signout`, {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">
        Update Your Profile
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* hidden image input */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profilePicRef}
          onChange={handleImageChange}
        />

        {/* profile image */}
        <div className="w-32 h-32 self-center cursor-pointer overflow-hidden">
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-8 border-gray-300"
            onClick={() => profilePicRef.current.click()}
          />
        </div>

        {/* username */}
        <Input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={handleChange}
        />

        {/* email */}
        <Input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={handleChange}
        />

        {/* password */}
        <Input
          type="password"
          id="password"
          placeholder="Password"
          className="h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={handleChange}
        />

         <Button type="submit" className="h-12 bg-green-600" disabled={loading}>
          {loading ? "Loading..." : "Update Profile"}
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="cursor-pointer">
              Delete Account
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600"
                onClick={handleDeleteUser}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={handleSignout}
        >          Sign Out
        </Button>
      </div>

      <p className="text-red-600">{error}</p>
    </div>
  )
}

export default DashboardProfile
