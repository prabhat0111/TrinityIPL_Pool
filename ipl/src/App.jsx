import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
import Matches from "./pages/matches";
import ResetPass from "./pages/resetpass";
import Admin from "./pages/Admin/admin";
import AddMatch from "./pages/Admin/addMatch";
import AdminUsers from "./pages/Admin/adminUsers";
// import EnterResults from "./pages/Admin/enterResults";
import EnterResult from "./pages/Admin/enterResults";
import Profile from "./pages/profile";
import MatchDetail from "./pages/matchDetail";
import Dashboard from "./pages/dashboard";
import Matrix from "./pages/matrix";
import MatrixB from "./pages/matrixb";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add-match" element={<AddMatch />} />
        <Route path="/admin/add-user" element={<AdminUsers />} />
        <Route path="/admin/enter-results" element={<EnterResult />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/matches/:id" element={<MatchDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matrix" element={<Matrix />} />
        <Route path="/matrixb" element={<MatrixB />} />





      </Routes>
    </BrowserRouter>
  );
}

export default App;