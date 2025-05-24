import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Index from "./pages/home/Index";
import Header from "./components/Header"
import Footer from "./components/Footer";
import Contact from "./pages/contact/Contact"
import Sidebar from "./components/Sidebar";
import About from "./pages/about/About";

function App() {
  return (

    <Router>
      {/* {loading ? <Looding /> : null} */}
      <Header />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/contact-us" element={<Contact />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
      <Footer />
      <Sidebar />
    </Router>
  );
}

export default App;
