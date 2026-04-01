import "./matches.css";
import Sidebar from "../components/sidebar";

function Matches() {
  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">

        {/* HEADER */}
        <div className="header-card">
          <p className="tag">REAL-TIME BETTING</p>
          <h1>LIVE MATCHES</h1>
          <p className="subtitle">
            Explore high-octane IPL betting markets with stadium-side odds
            updated every second.
          </p>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button>UPCOMING</button>
          <button className="active">LIVE NOW</button>
          <button>PAST</button>
        </div>

        {/* LIVE MATCH */}
        <div className="match-card">
          <div className="match-header">
            <span className="live">● LIVE NOW</span>
            <span>WANKHEDE STADIUM</span>
          </div>

          <div className="teams">
            <div className="team">
              <div className="team-logo">MI</div>
              <p>Mumbai Indians</p>
            </div>

            <div className="vs">VS</div>

            <div className="team">
              <div className="team-logo">CSK</div>
              <p>Chennai Super Kings</p>
            </div>
          </div>

          <div className="bets">
            <div className="bet active">
              <p>BACK MI</p>
              <h2>1.85</h2>
            </div>

            <div className="bet">
              <p>BACK CSK</p>
              <h2>2.10</h2>
            </div>
          </div>
        </div>

        {/* UPCOMING MATCH */}
        <div className="match-card">
          <div className="match-header">
            <span>UPCOMING</span>
            <span>CHINNASWAMY STADIUM</span>
          </div>

          <div className="teams">
            <div className="team">
              <div className="team-logo">RCB</div>
              <p>Royal Challengers</p>
            </div>

            <div className="time">
              <h2>19:30</h2>
              <p>MAY 24</p>
            </div>

            <div className="team">
              <div className="team-logo">KKR</div>
              <p>Kolkata Knight Riders</p>
            </div>
          </div>

          <div className="bets">
            <div className="bet">
              <p>BET ON RCB</p>
              <h2>1.92</h2>
            </div>

            <div className="bet">
              <p>BET ON KKR</p>
              <h2>1.88</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Matches;