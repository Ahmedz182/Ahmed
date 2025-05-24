import { useState } from "react";
import "remixicon/fonts/remixicon.css";

import "./App.css";
import Home from "./pages/HomePage/Home";
import Header from "./Components/Header";

function App() {
  const Menu = ["Home", "About Me", "Skills", "Projects", "Contact Me"];
  return (
    <>
      <Header title="Ahmed" menuItem={Menu} />
      <Home />
    </>
  );
}

export default App;
