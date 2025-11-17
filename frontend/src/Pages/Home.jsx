import Advertise from "@/components/shared/Advertise"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
const baseURL = import.meta.env.VITE_API_URL || "";

const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${baseURL}/api/post/getPosts?limit=6`,
        {
    credentials: "include", // ✅ add this
  }
      )
      const data = await res.json()
      if (res.ok) setPosts(data.posts)
    }

    fetchPosts()
  }, [])

  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 text-white py-24 px-6 text-center">
        <motion.h1
          className="text-5xl font-extrabold drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to <span className="text-yellow-300">News Today</span>
        </motion.h1>

        <motion.p
          className="text-lg mt-4 max-w-2xl mx-auto opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your trusted source for breaking news, insightful articles, and
          top-tier journalism — all in one place.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/search">
            <Button className="text-lg px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg rounded-full flex items-center gap-2">
              View All Posts <ArrowRight />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-800">Why Choose Us?</h2>
        <p className="text-gray-500 mt-2 mb-12">
          We bring fast, reliable and premium content to the digital world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard icon="📰" title="Breaking News" desc="Trustworthy coverage for the latest events worldwide." />
          <FeatureCard icon="👥" title="Community Based" desc="Built for readers, writers & daily news consumers." />
          <FeatureCard icon="⚡" title="Lightning Fast" desc="Optimized technology delivering news instantly." />
        </div>
      </section>

      {/* Advertise Section */}
      <div className="p-6">
        <Advertise />
      </div>

      {/* RECENT POSTS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {posts?.length > 0 && (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Latest Headlines</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/search">
                <button className="font-semibold text-blue-600 hover:underline">
                  View all news →
                </button>
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300"
    whileHover={{ scale: 1.04 }}
  >
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-500 mt-2">{desc}</p>
  </motion.div>
)

export default Home
