import "./App.css";
import React, { useState } from "react";
import LeaderboardTable from "./components/LeaderboardTable";
import Footer from "./components/Footer";
import AppTheme from "./Theme";
import clsx from "clsx";
import { ThemeProvider, makeStyles, createStyles } from "@mui/styles";

const useLocalStyles = makeStyles(() =>
  createStyles({
    app: {
      display: "grid",
      gridTemplateRows: "max-content 1fr max-content",
      gridGap: 20,

      // used to prevent vertical / horizontal scrollbars
      position: "absolute",
      top: 0,
      height: "100%",
      left: 0,
      width: "100%",
    },
  })
);

function App() {
  const [numLegends, setNumLegends] = useState<number>(0);
  const classes = useLocalStyles();

  return (
    <ThemeProvider theme={AppTheme}>
      <div className={clsx("App", classes.app)}>
        <header style={{ marginTop: "40px" }}>
          <img
            src="https://holygrail.one/holygrailonegame.png"
            alt="Holy Grail"
            className="logo"
          />
          <h1>Leaderboards</h1>
          <p>
            {`${
              numLegends > 0 ? `Legends Minted: ${numLegends} | ` : ""
            }Leaderboard refreshes every ~30 minutes`}
          </p>
        </header>

        <LeaderboardTable setNumLegends={setNumLegends} />

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
