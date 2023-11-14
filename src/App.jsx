import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import BarGraph from "./screens/BarGraph/BarGraph";
import Radar from "./screens/Radar/Radar";

function App() {
  return (
    <Router>
      <Routes>
        <Route Component={Home} path="/home" />
        <Route Component={BarGraph} path="/barGraph" />
        <Route Component={Radar} path="/radarChart" />
      </Routes>
    </Router>
  );
}

export default App;
