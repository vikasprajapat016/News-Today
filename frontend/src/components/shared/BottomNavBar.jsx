import React from "react"
import { signOutSuccess } from "@/redux/user/userSlice"
import { IoIosCreate, IoIosDocument } from "react-icons/io"
import { FaUsers, FaComments, FaSignOutAlt, FaUserAlt } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

const baseURL = import.meta.env.VITE_API_URL || "";

const BottomNavBar = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  const handleSignout = async () => {
    try {
      const res = await fetch(`${baseURL}/api/user/signout`, {
        method: "POST",
        credentials: "include",
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-200 border-t border-gray-300 p-2 flex justify-around z-50">

      {/* Profile */}
      <Link to="/dashboard?tab=profile" className="flex flex-col items-center text-slate-800">
        <FaUserAlt size={20} />
        <span className="text-xs">Profile</span>
      </Link>

      {/* Create Post */}
      {currentUser?.isAdmin && (
        <Link to="/create-post" className="flex flex-col items-center text-slate-800">
          <IoIosCreate size={20} />
          <span className="text-xs">Create</span>
        </Link>
      )}

      {/* Posts */}
      {currentUser?.isAdmin && (
        <Link to="/dashboard?tab=posts" className="flex flex-col items-center text-slate-800">
          <IoIosDocument size={20} />
          <span className="text-xs">Posts</span>
        </Link>
      )}

      {/* Users */}
      {currentUser?.isAdmin && (
        <Link to="/dashboard?tab=users" className="flex flex-col items-center text-slate-800">
          <FaUsers size={20} />
          <span className="text-xs">Users</span>
        </Link>
      )}

      {/* Comments */}
      {currentUser?.isAdmin && (
        <Link to="/dashboard?tab=comments" className="flex flex-col items-center text-slate-800">
          <FaComments size={20} />
          <span className="text-xs">Comments</span>
        </Link>
      )}

      {/* Logout */}
      <button onClick={handleSignout} className="flex flex-col items-center text-slate-800">
        <FaSignOutAlt size={20} />
        <span className="text-xs">Logout</span>
      </button>
    </nav>
  )
}

export default BottomNavBar
