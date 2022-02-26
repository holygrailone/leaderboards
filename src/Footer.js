import React from "react";
import swapIcon from "./assets/swap.png";
import twitterIcon from "./assets/twitter.png";
import discordIcon from "./assets/discord.png";
import mediumIcon from "./assets/medium.png";
import telegramIcon from "./assets/telegram.png";
import githubIcon from "./assets/github.png";
import voteIcon from "./assets/vote.png";
import rugdocIcon from "./assets/rugdoc.png";
import { useTheme } from "@mui/styles";
import { makeStyles, createStyles } from "@mui/styles";

const useLocalStyles = makeStyles((theme) =>
  createStyles({
    imgStyle: {
      width: 25,
      height: 25,
    },
  })
);

const spaceBetweenIcons = 35;

export default function Footer() {
  const classes = useLocalStyles();

  return (
    <div
      style={{
        marginBottom: "25px",
        display: "grid",
        gridGap: spaceBetweenIcons,
        gridAutoFlow: "column",
        justifyContent: "center",
      }}
    >
      <a href="https://swap.holygrail.one" target="_blank" rel="noreferrer">
        <img src={swapIcon} className={classes.imgStyle} alt="Swap" />
      </a>

      <a
        href="https://twitter.com/holygrailone"
        target="_blank"
        rel="noreferrer"
      >
        <img src={twitterIcon} className={classes.imgStyle} alt="Twitter" />
      </a>

      <a href="https://discord.gg/a5EkZtB9Fx" target="_blank" rel="noreferrer">
        <img src={discordIcon} className={classes.imgStyle} alt="Discord" />
      </a>

      <a
        href="https://medium.com/@holygrailone"
        target="_blank"
        rel="noreferrer"
      >
        <img src={mediumIcon} className={classes.imgStyle} alt="Medium" />
      </a>

      <a href="https://t.me/holygrailone" target="_blank" rel="noreferrer">
        <img src={telegramIcon} className={classes.imgStyle} alt="Telegram" />
      </a>

      <a
        href="https://github.com/holygrailone"
        target="_blank"
        rel="noreferrer"
      >
        <img src={githubIcon} className={classes.imgStyle} alt="Github" />
      </a>

      <a href="https://vote.holygrail.one" target="_blank" rel="noreferrer">
        <img src={voteIcon} className={classes.imgStyle} alt="Vote" />
      </a>

      <a
        href="https://rugdoc.io/project/holygrail/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={rugdocIcon} className={classes.imgStyle} alt="Rugdoc" />
      </a>
    </div>
  );
}
