import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import BookDetail from "./pages/BookDetail";
import Reader from "./pages/Reader";
import Profile from "./pages/Profile";
import ForYou from "./pages/ForYou";
export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isReaderRoute = location.pathname.startsWith("/read/");
  return <div className="min-h-screen">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {!isReaderRoute && <Navbar />}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/read/:id" element={<Reader />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/for-you" element={<ForYou />} />
        </Routes>
      </main>
      {!isAdminRoute && !isReaderRoute && <Footer />}
    </div>;
}
