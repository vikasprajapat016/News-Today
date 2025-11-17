import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { AiFillLike } from "react-icons/ai"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast } from "sonner"
import moment from "moment"

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

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({})
  const { currentUser } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)

  // 🔹 Fetch comment user info
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${baseURL}/api/user/${comment.userId}`)
        const data = await res.json()
        if (res.ok) setUser(data)
      } catch (error) {
        console.log(error.message)
        toast.error("Failed to fetch comment author")
      }
    }
    getUser()
  }, [comment.userId])

  // 🔹 Handle editing
  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(comment.content)
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${baseURL}/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      })
      if (res.ok) {
        setIsEditing(false)
        onEdit(comment, editedContent)
        toast.success("Comment updated!")
      } else {
        toast.error("Failed to update comment")
      }
    } catch (error) {
      console.log(error.message)
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="flex p-4 border-b border-slate-300 text-sm gap-2">
      {/* User Avatar */}
      <div className="shrink-0 mr-0">
        <img
          src={user.profilePicture || "/default-avatar.png"}
          alt={user.username || "Unknown"}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center mb-1">
          <span className="font-semibold mr-1 text-sm truncate flex items-center gap-1">
            {user.username ? `@${user.username}` : "Unknown"}
            {user?.isAdmin && (
              <span className="text-xs bg-slate-400 text-black px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </span>
          <span className="text-gray-500 text-sm">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {/* Editing / Display */}
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-sm">
              <Button type="button" className="bg-green-600" onClick={handleSave}>
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hover:border-red-500 hover:text-red-500"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-600 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-sm border-t border-slate-300 max-w-fit gap-2">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes?.includes(currentUser._id) &&
                  "text-blue-600"
                }`}
              >
                <AiFillLike className="text-lg" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes || 0}{" "}
                {(comment.numberOfLikes || 0) === 1 ? "like" : "likes"}
              </p>

              {/* Edit / Delete */}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-green-600"
                    >
                      Edit
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="text-gray-400 hover:text-red-600 cursor-pointer">
                          Delete
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your comment.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600"
                            onClick={() => onDelete(comment._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Comment
