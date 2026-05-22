import "../matches.css";
import Admin_Sidebar from "../../components/admin_sidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../../api";

const TEAM_FULL_NAMES = {
  RCB: "Royal Challengers Bangalore",
  MI: "Mumbai Indians",
  CSK: "Chennai Super Kings",
  KKR: "Kolkata Knight Riders",
  DC: "Delhi Capitals",
  SRH: "Sunrisers Hyderabad",
  RR: "Rajasthan Royals",
  PBKS: "Punjab Kings",
  GT : "Gujrat Titans",
  LSG : "Lukhnow Super Giants",
};

function Admin() {
  const [tab, setTab] = useState("today");
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const handleDelete = async (matchId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this match?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/admin/delete-match/${matchId}`, {
        method: "DELETE",
      });

      alert("Match deleted successfully");

      setMatches(matches.filter((m) => m.id !== matchId));
      setLiveMatches(liveMatches.filter((m) => m.id !== matchId));

    } catch (err) {
      console.error(err);
      alert("Failed to delete match");
    }
  };

  const handleEdit = (match) => {
    const localDate = new Date(match.match_time);

    const formatted =
      localDate.getFullYear() +
      "-" +
      String(localDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(localDate.getDate()).padStart(2, "0") +
      "T" +
      String(localDate.getHours()).padStart(2, "0") +
      ":" +
      String(localDate.getMinutes()).padStart(2, "0");

    setEditingMatch({
      ...match,
      match_time: formatted,
    });

    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await apiFetch(`/admin/edit-match/${editingMatch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingMatch),
      });

      alert("Match updated successfully");

      setShowEditModal(false);

      const data = await apiFetch(`/matches?status=${tab}`);
      setMatches(data);

      const liveData = await apiFetch(`/matches?status=live`);
      setLiveMatches(liveData);

    } catch (err) {
      console.error(err);
      alert("Failed to update match");
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await apiFetch(`/matches?status=${tab}`);
        setMatches(data);
      } catch (err) {
        if (err.message !== "Session expired") {
          console.error(err);
          alert("Error fetching matches");
        }
      }
    };

    const fetchLiveMatches = async () => {
      try {
        const data = await apiFetch(`/matches?status=live`);
        setLiveMatches(data);
      } catch (err) {
        if (err.message !== "Session expired") {
          console.error(err);
        }
      }
    };

    fetchMatches();
    fetchLiveMatches();
  }, [tab]);

  const renderMatch = (match) => (
    <div className="match-card" key={match.id}>
      <div className="match-header">
        <span className={match.status === "live" ? "live" : ""}>
          {match.status.toUpperCase()}
        </span>
        <span>STADIUM</span>
      </div>

      <div className="time">
        <p>
          {
          // new Date(match.match_time).toLocaleTimeString([], {
          //   hour: "2-digit",
          //   minute: "2-digit",
          // })
          
          // new Date(match.match_time).toLocaleTimeString("en-CA", {
          //   timeZone: "America/Toronto",
          //   hour: "2-digit",
          //   minute: "2-digit",
          // })
          new Date(match.match_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })


          }
        </p>

        {(match.status === "upcoming" || match.status === "completed") && (
          <p>
            {
            // new Date(match.match_time).toLocaleDateString()
            // new Date(match.match_time).toLocaleDateString("en-CA", {
            //   timeZone: "America/Toronto",
            //   year: "numeric",
            //   month: "short",
            //   day: "2-digit",
            // })
            // new Date(match.match_time).toLocaleDateString()
            new Date(match.match_time).toLocaleDateString([], {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            }
          </p>
        )}
      </div>

      <div className="teams">
        <div className="team">
          <div className="team-logo">
            {match.team1}
          </div>
            <p className="team-name">
            {TEAM_FULL_NAMES[match.team1] || match.team1}
            </p>

        </div>

        <div className="vs">VS</div>

        <div className="team">
          <div className="team-logo">
            {match.team2}
          </div>
            <p className="team-name">
            {TEAM_FULL_NAMES[match.team2] || match.team2}
            </p>
        </div>
      </div>

      {/* ✅ NO BETTING HERE */}
      <div className="bets">
        {match.status === "completed" ? (
          <div className="result">
            {!match.result
            ? "Result: TBD"
            : match.result === "No Result"
            ? "Match Abandoned / No Result"
            : `${match.result} won the match`}
          </div>
        ) : match.status === "live" ? (
          <p>Match is live</p>
        ) : match.status === "today" ? (
          <p>Picks are open (User side)</p>
        ) : (
          <p>Upcoming match</p>
        )}
      </div>
      
      <div className="admin-actions">
        <button
          className="edit-btn"
          onClick={() => handleEdit(match)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => handleDelete(match.id)}
        >
          Delete
        </button>
      </div>

    </div>
  );

  return (
    <div className="layout">
      <Admin_Sidebar />

      <div className="main-content">
        <div className="header-card">
          <p className="tag">ADMIN PANEL</p>
          <h1>ALL MATCHES</h1>
        </div>

        {/* LIVE */}
        {liveMatches.length > 0 && (
          <div className="live-section">
            <h2>LIVE NOW</h2>
            {liveMatches.map(renderMatch)}
          </div>
        )}

        {/* TABS */}
        <div className="tabs">
          <button
            onClick={() => setTab("upcoming")}
            className={tab === "upcoming" ? "active" : ""}
          >
            UPCOMING
          </button>

          <button
            onClick={() => setTab("today")}
            className={tab === "today" ? "active" : ""}
          >
            TODAY
          </button>

          <button
            onClick={() => setTab("completed")}
            className={tab === "completed" ? "active" : ""}
          >
            COMPLETED
          </button>
        </div>

        {/* MATCH LIST */}
        {
          (tab === "completed"
            ? [...matches].sort((a, b) => new Date(b.match_time) - new Date(a.match_time))
            : matches
          ).map(renderMatch)
        }


      </div>

    {showEditModal && editingMatch && (
      // <div className="modal-overlay">
      <div
        className="modal-overlay"
        onClick={() => setShowEditModal(false)}
      >
        {/* <div className="edit-modal"> */}
        <div
          className="edit-modal"
          onClick={(e) => e.stopPropagation()}
        >

          <h2>Edit Match</h2>

          <input
            value={editingMatch.team1}
            onChange={(e) =>
              setEditingMatch({
                ...editingMatch,
                team1: e.target.value,
              })
            }
          />

          <input
            value={editingMatch.team2}
            onChange={(e) =>
              setEditingMatch({
                ...editingMatch,
                team2: e.target.value,
              })
            }
          />

          <input
            type="datetime-local"
            value={editingMatch.match_time}
            onChange={(e) =>
              setEditingMatch({
                ...editingMatch,
                match_time: e.target.value,
              })
            }
          />

          <select
            value={editingMatch.status}
            onChange={(e) =>
              setEditingMatch({
                ...editingMatch,
                status: e.target.value,
              })
            }
          >
            <option value="upcoming">Upcoming</option>
            <option value="today">Today</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>

          <input
            placeholder="Result"
            value={editingMatch.result || ""}
            onChange={(e) =>
              setEditingMatch({
                ...editingMatch,
                result: e.target.value,
              })
            }
          />

          <div className="modal-actions">
            <button onClick={saveEdit}>Save</button>

            <button onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    )}

</div>
);
}

export default Admin;
