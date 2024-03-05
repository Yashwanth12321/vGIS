import "./App.css";
// Remove unused imports
import Features from "./pages/Features";
import FreeView from "./pages/FreeView";
import Home from "./pages/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Covid from "./pages/Covid";

function App() {
  return (
    <main className="bg-slate-300/20 h-[100vh]">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/freeView" element={<FreeView />} />
          <Route path="/covid" element={<Covid />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
