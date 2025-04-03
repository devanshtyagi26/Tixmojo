import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import EventDetails from "./pages/EventDetails";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { useState } from "react";
import { SidebarScroll } from "./Components/Sidebar";
import { UserSidebar } from "./Components/UserSidebar";
import { DefaultSEO } from "./utils/SEO";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  
  return (
    <>
      <DefaultSEO />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar
          isSidebarOpen={isSidebarOpen}
          toggleScrollPage={() => setIsSidebarOpen((prev) => !prev)}
          isUserSidebarOpen={isUserSidebarOpen}
          toggleUserSidebar={() => setIsUserSidebarOpen((prev) => !prev)}
        />
        {isSidebarOpen && (
          <SidebarScroll
            isSidebarOpen={isSidebarOpen}
            toggleScrollPage={() => setIsSidebarOpen((prev) => !prev)}
          />
        )}
        {isUserSidebarOpen && (
          <UserSidebar
            isUserSidebarOpen={isUserSidebarOpen}
            toggleUserSidebar={() => setIsUserSidebarOpen((prev) => !prev)}
          />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/page-not-found" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
