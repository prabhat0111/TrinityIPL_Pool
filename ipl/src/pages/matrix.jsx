import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { apiFetch, verifySession } from "../api";
import "./matrix.css";

function Matrix() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    verifySession().then((user) => {
      if (user) fetchMatrix();
    });
  }, []);

  const fetchMatrix = async () => {
    const res = await apiFetch("/matrix");
    setData(res);

    if (res.length > 0) {
      setUsers(Object.keys(res[0].predictions));
    }
  };

  const teamMap = {
    RCB: "Royal Challengers Bengaluru",
    SRH: "Sunrisers Hyderabad",
    MI: "Mumbai Indians",
    KKR: "Kolkata Knight Riders",
    CSK: "Chennai Super Kings",
    DC: "Delhi Capitals",
    RR: "Rajasthan Royals",
    PBKS: "Punjab Kings",
    LSG: "Lucknow Super Giants",
    GT: "Gujarat Titans"
  };

  return (
    <div className="page">
      <Sidebar />

      <div className="main-content">
        <div className="dashboard-header">
          <h1>Match Matrix</h1>
          <p>All picks & results</p>
        </div>

        {data.map((match, index) => (
          <div className="matrix-card" key={match.match_id}>

            {/* TOP ROW */}
            <div className="matrix-top">
              <span className="match-no">#{index + 1}</span>

              <span className="match-date">
                {new Date(match.match_time).toLocaleDateString("en-IN")}
              </span>
            </div>

            {/* MATCH INFO */}
            <div className="teams-row">
  
                <div className="team-block">
                    <div className="short">{match.team1}</div>
                    <div className="full">{teamMap[match.team1]}</div>
                </div>

                <div className="vs">VS</div>

                <div className="team-block">
                    <div className="short">{match.team2}</div>
                    <div className="full">{teamMap[match.team2]}</div>
                </div>

                </div>

            {/* PICKS */}
            <div className="matrix-users">
              {users.map((u) => {
                const p = match.predictions[u];
                const isCorrect = p?.pick === match.winner;

                return (
                  <div
                    key={u}
                    className={`user-pill ${
                      !p?.pick
                        ? "no-pick"
                        : isCorrect
                        ? "correct"
                        : "wrong"
                    }`}
                  >
                    <span className="user-name">{u}</span>
                    <span className="user-pick">
                      {p?.pick ? `${p.pick} (${p.points})` : "-"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* WINNER */}
            <div className="matrix-winner">
                {match.winner === "No Result" ? (
                    <span className="no-result">No Result</span>
                ) : match.winner ? (
                    `${match.winner} won`
                ) : (
                    "TBD"
                )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Matrix;