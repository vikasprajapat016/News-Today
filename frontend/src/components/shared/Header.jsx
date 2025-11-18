import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaSearch, FaBars, FaTimes } from "react-icons/fa"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutSuccess } from "@/redux/user/userSlice"

const baseURL = import.meta.env.VITE_API_URL || ""

const Header = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const location = useLocation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  return (
    <header className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="flex justify-between items-center max-w-6xl lg:max-w-7xl mx-auto py-4 px-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
<img
  src="/logo.png"
  alt="Logo"
  className="w-20 h-20 object-contain rounded-full"
  style={{ maxHeight: "64px" }} // keeps header height same
/>
        </Link>

        {/* Search (ALWAYS visible — Desktop + Mobile) */}
        <form
          className="flex p-2 bg-slate-100 rounded-lg items-center flex-1 max-w-xs sm:max-w-md mx-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="search..."
            className="focus:outline-none bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-3xl text-slate-700 ml-3"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 text-slate-700 font-medium">
          <Link to="/"><li>Home</li></Link>
          <Link to="/about"><li>About</li></Link>
          <Link to="/news"><li>NewsArticles</li></Link>

          {currentUser?.isAdmin && (
            <Link to="/dashboard"><li>Dashboard</li></Link>
          )}
        </ul>

        {/* Desktop Profile */}
        <div className="hidden lg:block">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={currentUser.profilePicture}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <span>@{currentUser.username}</span>
                    <span>@{currentUser.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/dashboard?tab=profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md p-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/news" onClick={() => setMenuOpen(false)}>NewsArticles</Link>

          {currentUser?.isAdmin && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}

          {currentUser ? (
            <>
             
              <button className="text-left text-red-600 font-semibold" onClick={handleSignout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
