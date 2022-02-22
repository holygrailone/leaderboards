import "./App.css";
import React from "react";

import swapIcon from "./assets/swap.png";
import twitterIcon from "./assets/twitter.png";
import discordIcon from "./assets/discord.png";
import mediumIcon from "./assets/medium.png";
import telegramIcon from "./assets/telegram.png";
import githubIcon from "./assets/github.png";
import voteIcon from "./assets/vote.png";
import rugdocIcon from "./assets/rugdoc.png";

const imgStyle = {
  width: 25,
  height: 25,
};

const spaceBetweenIcons = 35;

export default function Footer() {
  return (
    <div
      style={{ fontSize: "14px", margin: "0 auto", marginBottom: "25px" }}
      align="center"
    >
      <div
        style={{
          fontSize: "14px",
          margin: "0 auto",
          marginBottom: "25px",
          display: "grid",
          gridGap: spaceBetweenIcons,
          gridAutoFlow: "column",
          justifyContent: "center",
        }}
        align="center"
      >
        <a href="https://swap.holygrail.one" target="_blank" rel="noreferrer">
          <img src={swapIcon} style={imgStyle} />
        </a>

        <a
          href="https://twitter.com/holygrailone"
          target="_blank"
          rel="noreferrer"
        >
          <img src={twitterIcon} style={imgStyle} />
        </a>

        <a
          href="https://discord.gg/a5EkZtB9Fx"
          target="_blank"
          rel="noreferrer"
        >
          <img src={discordIcon} style={imgStyle} />
        </a>

        <a
          href="https://medium.com/@holygrailone"
          target="_blank"
          rel="noreferrer"
        >
          <img src={mediumIcon} style={imgStyle} />
        </a>

        <a href="https://t.me/holygrailone" target="_blank" rel="noreferrer">
          <img src={telegramIcon} style={imgStyle} />
        </a>

        <a
          href="https://github.com/holygrailone"
          target="_blank"
          rel="noreferrer"
        >
          <img src={githubIcon} style={imgStyle} />
        </a>

        <a href="https://vote.holygrail.one" target="_blank" rel="noreferrer">
          <img src={voteIcon} style={imgStyle} />
        </a>

        <a
          href="https://rugdoc.io/project/holygrail/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={rugdocIcon} style={imgStyle} />
        </a>
      </div>
    </div>
  );
}
