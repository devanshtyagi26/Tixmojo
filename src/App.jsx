import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { SidebarScroll } from "./Components/Sidebar";
import { useState } from "react";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleScrollPage={() => setIsSidebarOpen((prev) => !prev)}
      />
      {isSidebarOpen && (
        <SidebarScroll
          isSidebarOpen={isSidebarOpen}
          toggleScrollPage={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}
      {console.log(isSidebarOpen)}
      <Footer />
    </>
  );
}

export default App;
