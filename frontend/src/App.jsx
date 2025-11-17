import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpForm from "./auth/forms/SignUpForm"
import SignInForm from "./auth/forms/SignInForm"
import Home from "./Pages/Home"
import About from "./Pages/About"
import NewsArticles from "./Pages/NewsArticles"
import Dashboard from "./Pages/Dashboard"
import Header from "./components/shared/Header"
import { Toaster } from "sonner"   // ✅ FIXED
import Footer from "./components/shared/Footer";
import PrivateRoute from "./components/shared/PrivateRoute"
import CreatePost from "./Pages/CreatePost"
import AdminPrivateRoute from "./components/shared/AdminPrivateRoute"
import EditPost from "./Pages/EditPost"
import PostDetails from "./Pages/PostDetails"
import ScrollToTop from "./components/shared/ScrollToTop"
import Search from "./Pages/Search"

function App() {
  return (
    <BrowserRouter>
      <Header />
            <ScrollToTop />

      <Routes>
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />

        <Route path="/news" element={<Search />} />
        <Route path="/post/:postSlug" element={<PostDetails />} />

        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />

        </Route>
      </Routes>
       
      <Footer/>

      {/* ✅ Global toast container */}
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App