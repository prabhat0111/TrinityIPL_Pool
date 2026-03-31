import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;