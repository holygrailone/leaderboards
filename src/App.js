import "./App.css";
import React from "react";

// import Table from './Table.js';
import LeaderboardTable from "./LeaderboardTableV2.js";
import Footer from "./Footer";

function App() {
  return (
    <div className="App">
      <header style={{ marginTop: "55px" }}>
        <img
          src="https://holygrail.one/holygrailonegame.png"
          alt="Holy Grail"
          className="logo"
        />
        <h1>Leaderboards</h1>
        <p>
          These Holy Grail Leaderboards refresh statistics every ~30 minutes.
        </p>
        <br />
      </header>
      <LeaderboardTable />

      <div style={{ height: 70 }} />

      <Footer />
      <div className="App-body" />
    </div>
  );
}

export default App;
