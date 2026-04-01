import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
import Matches from "./pages/matches";
import ResetPass from "./pages/resetpass";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/resetpass" element={<ResetPass />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;