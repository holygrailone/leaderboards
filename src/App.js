import "./App.css";
import React, { useState } from "react";

import LeaderboardTable from "./LeaderboardTable.js";
import Footer from "./Footer";
import { ThemeProvider } from "@mui/styles";
import AppTheme from "./Theme";

function App() {
  const [numLegends, setNumLegends] = useState(0);
  return (
    <ThemeProvider theme={AppTheme}>
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
          {numLegends > 0 ? <p>Legends Minted: {numLegends}</p> : null}
          <br />
        </header>
        <LeaderboardTable setNumLegends={setNumLegends} />

        <div style={{ height: 70 }} />

        <Footer />
        <div className="App-body" />
      </div>
    </ThemeProvider>
  );
}

export default App;
