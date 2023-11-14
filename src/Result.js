// src/AppServer.js
import React from "react";
import { useParams } from "react-router-dom";

const Result = () => {
  const { type, input } = useParams();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {type === "search" ? (
        <>
          <h1>Result</h1>
          <h2 id="search-result">{input}</h2>
          <a href="/">
            <button id="back-button">back</button>
          </a>
        </>
      ) : (
        <>
          <h1>Welcome</h1>
          <h2>{input}</h2>
          <a href="/login">
            <button>logout</button>
          </a>
        </>
      )}
    </div>
  );
};

export default Result;
