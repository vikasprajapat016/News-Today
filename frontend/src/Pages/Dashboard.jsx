import BottomNavBar from "@/components/shared/BottomNavBar"
import DashboardProfile from "@/components/shared/DashboardProfile"
import DashboardSidebar from "@/components/shared/DashboardSidebar"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashboardPosts from "@/components/shared/DashboardPosts"
import DashboardUsers from "@/components/shared/DashboardUsers"
import DashboardComments from "@/components/shared/DashboardComments"

const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab] = useState("profile")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")

    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row w-full">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNavBar />

      {/* Main Dashboard Content */}
      <div className="w-full pb-24 md:pb-0 px-3 md:px-6">
        {tab === "profile" && <DashboardProfile />}
        {tab === "posts" && <DashboardPosts />}
        {tab === "users" && <DashboardUsers />}
        {tab === "comments" && <DashboardComments />}
      </div>
    </div>
  )
}

export default Dashboard
