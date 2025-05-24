import { useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./App.css";
import Home from "./pages/HomePage/Home";
import Nav from "./Components/Nav";

function App() {
  const Menu = ["Home", "About Me", "Skills", "Projects", "Contact Me"];
  return (
    <>
      <Nav title="Ahmed.Dev" menuItem={Menu} />
      <Home />
    </>
  );
}

export default App;
