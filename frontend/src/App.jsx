import "./App.css";
// Remove unused imports
import Features from "./pages/Features";
import FreeView from "./pages/FreeView";
import Home from "./pages/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Covid from "./pages/Covid";
import ThreeD from "./pages/ThreeD";
import Classic from "./pages/Classic";
import IndiaMap from "./pages/IndiaMap";
import DataVisuals from "./pages/DataVisuals";

import IndiaGDP from "./pages/IndiaGDP";
import StateGDP from "./pages/StateGDP";

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
          <Route path="/threeD" element={<ThreeD />} />
          <Route path="/classic" element={<Classic />} />
          <Route path="/deathchloropeth" element={<IndiaMap />} />
          <Route path="/datavisuals" element={<DataVisuals />} />
          <Route path="/IndiaGDP" element={<IndiaGDP />} />
          <Route path="/state/:stateName" element={<StateGDP />} /> 
        </Routes>
      </Router>
    </main>
  );
}

export default App;
