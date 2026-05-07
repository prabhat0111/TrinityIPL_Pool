import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { apiFetch, verifySession } from "../api";
import "./matrixb.css";

function MatrixB() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect(() => {
  //   verifySession().then((user) => {
  //     if (user) fetchMatrix();
  //   });
  // }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await verifySession();
        console.log("VERIFY:", res); // debug

        const userData = res?.user || res;

        if (userData) {
          setCurrentUser(userData.name?.trim().toLowerCase());
        }

        // ✅ ALWAYS call this
        await fetchMatrix();

      } catch (err) {
        console.error("VERIFY FAILED:", err);

        // still load matrix even if verify fails
        await fetchMatrix();
      }
    };

  init();
}, []);

  const fetchMatrix = async () => {
  const res = await apiFetch("/matrix");
  console.log("MATRIX DATA:", res); // 👈 IMPORTANT

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
          <h1>Match Matrix (Table)</h1>
          <p>Tabular view for comparison</p>
        </div>

        <div className="table-container">
          <table className="matrix-table">

            {/* HEADER */}
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Match</th>

                {users.map((u) => (
                  <th key={u}>{u}</th>
                ))}

                <th>Winner</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((match, index) => (
                <tr key={match.match_id}>

                  <td>{index + 1}</td>

                  <td>
                    {new Date(match.match_time).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="match-cell">
                      <div className="short">
                        {match.team1} vs {match.team2}
                      </div>
                      <div className="full">
                        {teamMap[match.team1]} vs {teamMap[match.team2]}
                      </div>
                    </div>
                  </td>

                  {users.map((u) => {
                    // const p = match.predictions[u];
                    // const isNoResult = match.winner === "No Result";
                    // const isCorrect =
                    //   !isNoResult && p?.pick === match.winner;

                    const p = match.predictions[u];

                    const isUpcoming = match.status === "upcoming" || match.status === "today";
                    const isLive = match.status === "live";
                    const isCompleted = match.status === "completed";

                    const isOwnPick = u?.trim().toLowerCase() === currentUser;

                    const isNoResult = match.winner === "No Result";
                    const isCorrect =
                      isCompleted && !isNoResult && p?.pick === match.winner;

                    return (
                      // <td
                      //   key={u}
                      //   className={
                      //     !p?.pick
                      //       ? "no-pick"
                      //       : isNoResult
                      //       ? "no-result"
                      //       : isCorrect
                      //       ? "correct"
                      //       : "wrong"
                      //   }
                      // >
                      //   {p?.pick ? `${p.pick} (${p.points})` : "-"}
                      // </td>
                      <td
                        key={u}
                        className={
                          isUpcoming
                            ? isOwnPick
                              ? "own-pick"
                              : "hidden-pick"
                            : isCompleted
                            ? !p?.pick
                              ? "no-pick"
                              : isNoResult
                              ? "no-result"
                              : isCorrect
                              ? "correct"
                              : "wrong"
                            : "" // live → no colors
                        }
                      >
                        {isUpcoming
                          ? isOwnPick
                            ? p?.pick
                              ? `${p.pick}`   // ✅ show only team
                              : "-"
                            : "X"
                          : p?.pick
                          ? `${p.pick} (${p.points})`
                          : "-"}
                      </td>
                    );
                  })}

                  {/* <td className="winner">
                    {match.winner === "No Result"
                      ? "No Result"
                      : match.winner
                      ? `${match.winner} won`
                      : "TBD"}
                  </td> */}

                  <td className="winner">
                    {match.status === "upcoming" || match.status === "today"
                      ? "Match Not Started"
                      : match.status === "live"
                      ? "Match is Live"
                      : match.winner === "No Result"
                      ? "No Result"
                      : match.winner
                      ? `${match.winner} won`
                      : "TBD"}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default MatrixB;
